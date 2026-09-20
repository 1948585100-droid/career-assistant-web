/**
 * 最底层的 IndexedDB 封装。
 *
 * 不依赖任何第三方库（idb / dexie 等），只用浏览器原生 IndexedDB API，
 * 对上层 Repository 暴露一组基于 Promise 的通用 CRUD 方法。
 *
 * 设计目标：
 * 1. 数据层与 UI 完全解耦（pages/components 不直接碰 IndexedDB）。
 * 2. 所有表都以 `id: string` 作为主键，方便未来替换为远程 API（RESTful 语义一致）。
 * 3. 未来如果要接入真正的后端 / AI API，只需要新增一个 remoteRepository 实现同样的接口即可。
 */

export const DB_NAME = "career_os_db";
export const DB_VERSION = 2; // v2：新增 tags 表（标签颜色等元数据），已有数据库会在打开时自动补建这张表

export const STORE_NAMES = [
  "user",
  "resumes",
  "experiences",
  "resumeVersions",
  "jobs",
  "interviews",
  "mistakes",
  "companyNotes",
  "tasks",
  "tags",
  "meta",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

/** 打开（或首次创建）数据库，惰性单例，避免重复 open 连接 */
export function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持 IndexedDB，无法使用本地数据存储。"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of STORE_NAMES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("打开 IndexedDB 失败"));
    request.onblocked = () => reject(new Error("IndexedDB 被其他标签页阻塞，请关闭其他标签页后重试。"));
  });

  return dbPromise;
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB 操作失败"));
  });
}

function promisifyTx(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB 事务失败"));
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB 事务已中止"));
  });
}

/** 读取某个表的全部记录 */
export async function getAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDatabase();
  const tx = db.transaction(store, "readonly");
  const result = await promisifyRequest<T[]>(tx.objectStore(store).getAll());
  return result;
}

/** 按 id 读取单条记录 */
export async function getById<T>(store: StoreName, id: string): Promise<T | undefined> {
  const db = await openDatabase();
  const tx = db.transaction(store, "readonly");
  return promisifyRequest<T | undefined>(tx.objectStore(store).get(id));
}

/** 新增或更新一条记录（按 id 覆盖） */
export async function put<T extends { id: string }>(store: StoreName, item: T): Promise<T> {
  const db = await openDatabase();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).put(item);
  await promisifyTx(tx);
  return item;
}

/** 批量写入，常用于导入备份或首次播种 mock 数据 */
export async function bulkPut<T extends { id: string }>(store: StoreName, items: T[]): Promise<void> {
  if (items.length === 0) return;
  const db = await openDatabase();
  const tx = db.transaction(store, "readwrite");
  const os = tx.objectStore(store);
  for (const item of items) os.put(item);
  await promisifyTx(tx);
}

/** 删除单条记录 */
export async function remove(store: StoreName, id: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).delete(id);
  await promisifyTx(tx);
}

/** 清空整张表，谨慎使用（重置数据时会用到） */
export async function clearStore(store: StoreName): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).clear();
  await promisifyTx(tx);
}

/** 清空全部业务表，保留数据库结构 */
export async function clearAll(): Promise<void> {
  for (const name of STORE_NAMES) {
    await clearStore(name);
  }
}
