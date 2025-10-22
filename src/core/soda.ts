import type z from "zod";
import { callTools } from "../tools";
import type { InputSchema, Model, OutputSchema, Signature } from "./types";
import { getDebugCollector } from "../debug-collector";
import util from 'node:util';
import { createToolData, printCallsMade } from '../tools/tool-data';
import { callModel } from "./call-model";
import { callModelChunked } from "./chunking/call-model-chunked";

type Options = {
    debug?: boolean
}

export const soda = <I extends InputSchema, O extends OutputSchema>(
    model: Model,
    sig: Signature<I, O>,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],

) => {
    type Input = z.infer<I>;
    type Output = z.infer<O>;

    type CallResponse = Output;

    const call = async (input: Input, options?: Options): Promise<CallResponse> => {
        const debug = options?.debug ?? false;

        const debugCollector = getDebugCollector();
        try {
            const toolData = createToolData(sig.tools);
            if (sig.tools?.length) {
                const toolDebugCollector = debugCollector.createSubSection('Call tools');

                await callTools(model, sig, input, toolData, toolDebugCollector);
                toolDebugCollector.collect('Final tool context:', printCallsMade(toolData));
            }
            const toolContext = toolData.callsMade.length > 0 ? printCallsMade(toolData) : undefined;

            const data = sig.chunking
                ? await callModelChunked(sig, input, debug, debugCollector, model, examples, toolContext)
                : await callModel(sig, input, debug, debugCollector, model, examples, toolContext);

            if (debug) {
                debugCollector.collect('Resulting data', JSON.stringify(data, null, 2), false);
                debugCollector.printReport();
            }

            return data;
        } catch (error) {

            if (debug) {
                debugCollector.error('Error', util.inspect(error, { depth: null, colors: false }), false);
                debugCollector.printReport();
            }
            throw error;
        }
    }

    return call
}
