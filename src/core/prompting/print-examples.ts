import type z from "zod";
import type { InputSchema, OutputSchema, Signature } from "../types";
import { generateMock } from "@anatine/zod-mock";
import { printJson } from "./print-schema";

export const printExamples = <I extends InputSchema, O extends OutputSchema>(
    examples: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[]
) => {
    return `Below are examples only\n` + examples.map((example, index) =>
        printExample(example, index)
    ).join('\n');
}

export const printDefaultExample = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>,) => {
    const mergedSchema = signature.outputs.merge(signature.inputs);
    // let schema = printSchema(mergedSchema);
    const outputMock = generateMock(mergedSchema);
    return JSON.stringify(outputMock);
}

const printExample = <I extends InputSchema, O extends OutputSchema>(example: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }, index: number) => {
    const inputs = printJson(example.given);
    // const inputs = Object.entries(example.given)
    //     .map(([key, value]) => firstLetterUppercase(key) + ": " + parseTypeForValue(value))
    //     .join('\n');

    const outputs = printJson({ ...example.expect, ...example.given });

    return `
### Example ${index + 1} ${example.incorrect ? `[Bad example - response is wrong because ${example.incorrect}]` : ''}:
Given:
\`\`\`json
${inputs}
\`\`\`

Return:
\`\`\`json
${outputs}
\`\`\`

    `;
}
