import { numberQuestionFn } from "./number-question-fn";

const question = "How many cats are in a typical litter?";
const { answer, reason } = await numberQuestionFn({ question }, { debug: true });

console.log('Answer: ', answer);
console.log('Reason: ', reason);