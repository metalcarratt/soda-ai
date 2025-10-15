import type z from "zod";
import { firstLetterUppercase } from "../../util";
import type { InputSchema, OutputSchema, Signature } from "../types";
import { generateMock } from "@anatine/zod-mock";

export const printExamples = <I extends InputSchema, O extends OutputSchema>(examples: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[]) => {
    return examples.map((example, index) =>
        printExample(example, index)
    ).join('\n');
}

export const printDefaultExample = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>,) => {
    const outputMock = generateMock(signature.outputs);
    return JSON.stringify(outputMock);
}

const printExample = <I extends InputSchema, O extends OutputSchema>(example: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }, index: number) => {
    const inputs = Object.entries(example.given)
        .map(([key, value]) => firstLetterUppercase(key) + ": " + parseTypeForValue(value))
        .join('\n');

    const outputs = JSON.stringify(example.expect);

    return `
### Example ${index + 1} ${example.incorrect ? `[Bad example - response is wrong because ${example.incorrect}]` : ''}:
Given:
'''
${inputs}
'''

Return:
'''
${outputs}
'''

    `;
}


const parseTypeForValue = (value: unknown) => {
    if (typeof value === 'boolean') {
        if (value === true) return 'True';
        else return 'False';
    }
    return `${value}`;
}