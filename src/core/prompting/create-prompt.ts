import type z from "zod";
import { printOutputs } from "./print-outputs";
import { printInputs } from "./print-inputs";
import { printExamples } from "./print-examples";
import type { InputSchema, OutputSchema, Signature } from "../types";

export const createPrompt = <I extends InputSchema, O extends OutputSchema>(
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],
    toolContext?: string,
) => {
    const prompt = `
Your task is to ${signature.action}. ${printRules(signature.rules)} 

Given the following input in triple quotes:
${printInputs(signature, userInput)}

Respond with exactly the following format in triple quotes:
${printOutputs(signature, userInput)}

${toolContext ? 'You have been provided with the following context: ' + toolContext : ''}

${examples ? printExamples<I, O>(examples) : ''}
    `;

    // Do not include any additional explanation, commentary, or alternative phrasing.
    // Only output in the format above.

    return prompt;
}

const printRules = (rules?: string[]) => {
    if (!rules) return '';

    const rulesText = rules.map(rule => `- ${rule}`).join('\n');

    return `Rules:\n${rulesText}`;
}