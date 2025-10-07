import { type ZodObject, type ZodRawShape } from "zod";
import type { Tool } from "../tools";

export type Model = {
    call: (prompt: string) => Promise<string>;
}

export type InputSchema = ZodObject<ZodRawShape>;
export type OutputSchema = ZodObject<ZodRawShape>;

export type Signature<I, O> = {
    action: string,
    inputs: I,
    outputs: O,
    examples?: { input: I, output: O }[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools?: Tool<any, any>[]
};
