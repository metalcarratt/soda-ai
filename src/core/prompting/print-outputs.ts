import type z from "zod";
import { firstLetterUppercase } from "../../util";
import { ZodBoolean, ZodEnum, ZodNumber } from "zod";
import type { InputSchema, OutputSchema, Signature } from "../types";

export const printOutputs = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>) => {
    const listOfOutputs = Object.entries(signature.outputs.shape)
        .map(([outputName, outputSchema]) => printOutput(outputName, outputSchema))
        .join('\n');

    return `
'''
${listOfOutputs}
'''    
    `;
}

const printOutput = (outputName: string, outputSchema: z.ZodTypeAny) => {
    const typeDesc = getTypeDesc(outputSchema);
    const name = firstLetterUppercase(outputName);
    const desc = outputName + typeDesc;

    return `${name}: [${desc}]`;
}

const getTypeDesc = (outputSchema: z.ZodTypeAny) => {
    const description = outputSchema.description ? ` - ${outputSchema.description}` : '';

    if (outputSchema instanceof ZodNumber) {
        return ` as a number only${description}`;
    }
    if (outputSchema instanceof ZodBoolean) {
        return ` as True or False only${description}`;
    }
    if (outputSchema instanceof ZodEnum) {
        return ` as one of ${JSON.stringify(outputSchema.options)} only${description}`;
    }
    return '';
}