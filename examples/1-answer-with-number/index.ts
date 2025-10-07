import { numberQuestionFn } from "./number-question-fn";

const question = "How many cats are in a typical litter?";
const response = await numberQuestionFn({ question });

console.log('Answer: ', response.data.answer);
console.log('Reason: ', response.data.reason);