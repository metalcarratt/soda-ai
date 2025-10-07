import type z from "zod";
import { firstLetterUppercase } from "../../util";
import type { InputSchema, OutputSchema } from "../types";

export const printExamples = <I extends InputSchema, O extends OutputSchema>(examples: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[]) => {
    return examples.map((example, index) => {
        const inputs = Object.entries(example.given)
            .map(([key, value]) => firstLetterUppercase(key) + ": " + parseTypeForValue(value))
            .join('\n');

        const outputs = Object.entries(example.expect)
            .map(([key, value]) => firstLetterUppercase(key) + ": " + parseTypeForValue(value))
            .join('\n');

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
    }).join('\n');
}

const parseTypeForValue = (value: unknown) => {
    if (typeof value === 'boolean') {
        if (value === true) return 'True';
        else return 'False';
    }
    return `${value}`;
}