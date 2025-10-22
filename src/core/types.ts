import z, { type ZodObject, type ZodRawShape } from "zod";
import type { Tool } from "../tools";

export type Model = {
    call: (prompt: string) => Promise<string>;
}

export type InputSchema = ZodObject<ZodRawShape>;
export type OutputSchema = ZodObject<ZodRawShape>;

export type Signature<I extends InputSchema, O extends OutputSchema> = {
    action: string,
    rules?: string[],
    inputs: I,
    outputs: O,
    chunking?: {
        input: string,
        promptLimit: number,
        mergeFn: (current: z.infer<O>, previous?: z.infer<O>) => z.infer<O>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools?: Tool<any, any>[]
};
