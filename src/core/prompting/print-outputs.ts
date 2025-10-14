import type z from "zod";
import { firstLetterUppercase } from "../../util";
import type { ZodEnum } from "zod";
import type { InputSchema, OutputSchema, Signature } from "../types";

export const printOutputs = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>, inputs: z.infer<I>) => {
    const listOfOutputs = Object.entries(signature.outputs.shape)
        .map(([outputName, outputSchema]) => printOutput(outputName, outputSchema, inputs))
        .join('\n');

    return `
'''
${listOfOutputs}
'''    
    `;
}

const printOutput = (outputName: string, outputSchema: z.ZodTypeAny, inputs: Record<string, string>) => {
    const typeDesc = getTypeDesc(outputSchema, inputs);
    const name = firstLetterUppercase(outputName);
    const desc = outputName + typeDesc;

    return `${name}: [${desc}]`;
}

const getTypeDesc = (outputSchema: z.ZodTypeAny, inputs: Record<string, string>) => {
    let description = '';
    if (outputSchema.description) {
        description = ` - ${outputSchema.description}`;
        for (let key of Object.keys(inputs)) {
            const searchKey = `{${key}}`;
            if (description.includes(searchKey)) {
                description = description.replace(searchKey, inputs[key]);
            }
        }
    }
    const typeName = outputSchema._def.typeName;
    // console.log('getting type desc', typeName)

    if (typeName === 'ZodNumber') {
        // console.log('is ZodNumber');
        return ` as a number only${description}`;
    }
    if (typeName === 'ZodBoolean') {
        // console.log('is ZodBoolean');
        return ` as True or False only${description}`;
    }
    if (typeName === 'ZodEnum') {
        // console.log('is ZodEnum');
        return ` as one of ${JSON.stringify((outputSchema as ZodEnum<any>).options)} only${description}`;
    }
    return description;
}