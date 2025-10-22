import type z from "zod";
import { printOutputs } from "./print-outputs";
import { printInputs } from "./print-inputs";
import { printDefaultExample, printExamples } from "./print-examples";
import type { InputSchema, OutputSchema, Signature } from "../types";
import { printSchema } from "./print-schema";

export const createPrompt = <I extends InputSchema, O extends OutputSchema>(
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],
    toolContext?: string,
) => {
    const prompt = `
${examples ? printExamples<I, O>(examples) : ''}

Your task is to ${signature.action}. ${printRules(signature.rules)} 

Input schema:
\`\`\`json
${printSchema(signature.inputs)}
\`\`\`

Below is the current input provided by the user:
${printInputs(userInput)}

Respond with a JSON object that exactly matches the following Zod schema in triple quotes:
\`\`\`json
${printOutputs(signature, userInput)}
\`\`\`
Do not include any additional explanation, commentary, or alternative phrasing.
Only output JSON in the format above.
For example, this is a valid JSON object according to the above schema: ${printDefaultExample(signature)}

${toolContext ? 'You have been provided with the following context: ' + toolContext : ''}
    `;

    return prompt;
}

const printRules = (rules?: string[]) => {
    if (!rules) return '';

    const rulesText = rules.map(rule => `- ${rule}`).join('\n');

    return `Rules:\n${rulesText}`;
}
