import type z from "zod";
import type { InputSchema, OutputSchema, Signature } from "../types";
import { printSchema } from './print-schema';

export const printOutputs = <I extends InputSchema, O extends OutputSchema>(signature: Signature<I, O>, inputs: z.infer<I>) => {

    let schema = printSchema(signature.outputs);

    for (let key of Object.keys(inputs)) {
        const searchKey = `{${key}}`;
        if (schema.includes(searchKey)) {
            schema = schema.replace(searchKey, inputs[key]);
        }
    }

    return schema;
}