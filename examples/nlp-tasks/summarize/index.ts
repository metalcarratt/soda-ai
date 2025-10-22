import { text } from "../common/abraham-lincoln-text";
import { summarize } from "./summarize";

const { summary } = await summarize({ text, wordCount: 10 }, { debug: true });
console.log('Summary: ', summary);
