import { validateSummary } from "./validate-summary";

const { result, rationale } = await validateSummary({
    summary: "offensive language",
    text: "My password is 1234"
}, { debug: true });

console.log('Result: ', result);
console.log('Rationale: ', rationale);

