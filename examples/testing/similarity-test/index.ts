import { testSimilarity } from "./similarity-test";

const { result, rationale } = await testSimilarity({
    provided: 'Good morning',
    expected: "Hello"
});

console.log('Result: ', result);
console.log('Rationale: ', rationale);
