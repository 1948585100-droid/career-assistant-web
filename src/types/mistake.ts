/**
 * 错题集模块的类型入口。
 *
 * 和 types/interview.ts 一样：Mistake 的真正定义留在 src/types/index.ts
 * （和 Job / Resume / Experience / Interview 放在一起，保持单一事实来源），
 * 这个文件只是按你的要求提供一个 `types/mistake.ts` 的入口。
 */
export type { Mistake, MistakeSource, MistakeImportance } from "./index";
export { MISTAKE_SOURCES, MISTAKE_IMPORTANCE_OPTIONS, HIGH_FREQUENCY_THRESHOLD, MID_FREQUENCY_THRESHOLD } from "./index";
