import type z from "zod";
import { firstLetterUppercase } from "../util";
import { ZodOptional } from "zod";
import type { OutputSchema } from "./types";

export const parseResponse = <O extends OutputSchema>(
    response: string,
    outputSignature: O
): z.infer<O> => {
    const outputs = Object.entries(outputSignature.shape);
    const lines = response.split('\n');
    const result: Record<string, unknown> = {};
    for (const [key, schema] of outputs) {
        const upperKey = firstLetterUppercase(key);
        const match = lines.find(line => line.includes(`${upperKey}:`));
        if (match) {
            const value = match.slice(key.length + 1).trim();
            const parsedValue = parseValueForType(value, schema);
            result[key] = parsedValue;
        }
    }
    return outputSignature.parse(result);
}

const parseValueForType = (value: string, valueSchema: z.ZodTypeAny) => {
    // console.log(`In parseValueForType. value: ${value}.`);
    const unwrappedSchema = valueSchema instanceof ZodOptional ? valueSchema.unwrap() : valueSchema;
    const schemaType = unwrappedSchema._def.typeName

    if (schemaType === 'ZodNumber') {
        // console.log('is ZodNumber');
        return Number(value);
    }

    if (schemaType === 'ZodBoolean') {
        // console.log('is ZodBoolean');
        if (value === 'True') {
            return true;
        } else if (value === 'False') {
            return false;
        }
    }

    if (schemaType === 'ZodEnum') {
        // console.log('value is an ZodEnum');
        const enumValues = unwrappedSchema.options;

        const match: string | number | undefined = enumValues.find((e: unknown) => typeof e === 'string' && e.toLowerCase() === value.toLowerCase());
        // console.log('got match', match);
        if (!match) {
            return value;
        }

        return match;
    }

    if (schemaType === 'ZodObject' || schemaType === 'ZodRecord') {
        // console.log('value is an ZodObject');
        return JSON.parse(value);
    }

    if (schemaType === 'ZodArray') {
        // console.log('value is a ZodArray');
        return JSON.parse(value);
    }

    // console.log('value is string or unknown', unwrappedSchema._def.typeName);
    return value;
}