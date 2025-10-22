import z from "zod";
import { InputSchema, Model, OutputSchema, parseResponse, Signature } from ".";
import { createPrompt } from "./prompting/create-prompt";
import { DebugCollector } from "../debug-collector";

export const callModel = async <I extends InputSchema, O extends OutputSchema>(
    sig: Signature<I, O>,
    input: z.infer<I>,
    debug: boolean,
    debugCollector: DebugCollector,
    model: Model,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],
    toolContext?: string
) => {

    const prompt = createPrompt(sig, input, examples, toolContext);
    if (debug) {
        debugCollector.collect('Main prompt', prompt);
    }

    const response = await model.call(prompt);
    if (debug) {
        debugCollector.collect('Main LLM response', response);
    }

    return parseResponse(`${response}`, sig.outputs);
}