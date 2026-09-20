import type { StoreName } from "./database";

/**
 * 极简的发布订阅总线。
 *
 * 由于没有引入 react-query / zustand 等状态库，多个页面各自用 useState 保存数据，
 * 当某个 Repository 写入数据后，通过这个事件总线通知"关心该表"的组件重新拉取，
 * 从而实现跨页面/跨组件的数据同步（例如新增岗位后 Dashboard 的统计立即刷新）。
 */

type Listener = () => void;

const listeners = new Map<StoreName, Set<Listener>>();

export function subscribe(store: StoreName, listener: Listener): () => void {
  if (!listeners.has(store)) listeners.set(store, new Set());
  listeners.get(store)!.add(listener);
  return () => {
    listeners.get(store)?.delete(listener);
  };
}

export function publish(store: StoreName): void {
  listeners.get(store)?.forEach((fn) => fn());
}

export function publishMany(stores: StoreName[]): void {
  stores.forEach(publish);
}
