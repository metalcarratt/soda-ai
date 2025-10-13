import z from "zod";
import type { Tool, ToolInput, ToolOutput, ToolSignature } from "./types";

const defaultSig = {
    input: z.object({}),
    output: z.string()
};

export const createTool = <I extends ToolInput, O extends ToolOutput>(
    { name, instruct, deterministic, signature: sig, call }:
        {
            name: string,
            instruct: string,
            deterministic?: boolean,
            signature?: ToolSignature<I, O>,
            call: (arg: z.infer<I>) => z.infer<O>
        }): Tool<I, O> => {
    const resolvedSig = sig ?? (defaultSig as unknown as ToolSignature<I, O>);
    return {
        name,
        instruct,
        deterministic: deterministic ?? true,
        signature: resolvedSig,
        call
    }
};