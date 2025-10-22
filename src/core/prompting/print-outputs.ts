import type z from "zod";
import type { InputSchema, OutputSchema, Signature } from "../types";
import { printSchema } from './print-schema';

export const printOutputs = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>, inputs: z.infer<I>) => {

    const mergedSchema = signature.outputs.merge(signature.inputs);
    let schema = printSchema(mergedSchema);

    for (let key of Object.keys(inputs)) {
        const searchKey = `{${key}}`;
        if (schema.includes(searchKey)) {
            schema = schema.replace(searchKey, inputs[key]);
        }
    }

    return schema;
}