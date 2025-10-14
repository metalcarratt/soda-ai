import { text } from "../common/abraham-lincoln-text";
import { summarize } from "./summarize";

const response = await summarize({ text, wordCount: 50 });
console.log('Summary: ', response.data.summary);
