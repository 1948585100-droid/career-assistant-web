/**
 * 面试模块的类型入口。
 *
 * 为了避免把类型定义拆得到处都是（Job / Resume / Mistake / Experience 都统一放在
 * src/types/index.ts 里），Interview / QA / InterviewReview 的真正定义仍然留在
 * index.ts 作为唯一事实来源，这个文件只是按你的要求提供一个 `types/interview.ts`
 * 的入口，方便面试模块内部用更短的相对路径导入。
 */
export type { Interview, QA, InterviewReview } from "./index";
export { INTERVIEW_ROUNDS } from "./index";
