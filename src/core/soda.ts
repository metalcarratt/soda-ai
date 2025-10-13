import { parseResponse } from "./parse-response";
import { createPrompt } from "./prompting/create-prompt";
import type z from "zod";
import { callTools } from "../tools";
import type { InputSchema, Model, OutputSchema, Signature } from "./types";
import { getDebugCollector } from "../debug-collector";
import util from 'node:util';
import { createToolData, printCallsMade } from '../tools/tool-data';

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

    type CallResponse = {
        prompt: string,
        raw: string,
        data: Output
    }

    const call = async (input: Input, options?: Options): Promise<CallResponse> => {
        const debug = options?.debug ?? false;

        const debugCollector = getDebugCollector();
        try {
            const toolData = createToolData(sig.tools);
            if (sig.tools?.length) {
                const toolDebugCollector = debugCollector.createSubSection('Call tools');

                await callTools(model, sig, input, toolData, toolDebugCollector);
                // console.log('Got tool context', toolContext);
                toolDebugCollector.collect('Final tool context:', printCallsMade(toolData));
            }
            const toolContext = printCallsMade(toolData);

            const prompt = createPrompt(sig, input, examples, toolContext);
            if (debug) {
                debugCollector.collect('Main prompt', prompt);
            }

            const response = await model.call(prompt);
            if (debug) {
                console.log('response', response);
                debugCollector.collect('Main LLM response', response);
            }

            const data = parseResponse(`${response}`, sig.outputs);
            // if (Object.keys(data).length !== sig.outputs.length) {
            //     // retry
            //     response = await model.call(prompt);
            //     data = parseResponse(`${response}`, sig);
            // }

            if (debug) {
                debugCollector.collect('Resulting data', JSON.stringify(data, null, 2), false);
                debugCollector.printReport();
            }

            return {
                prompt,
                raw: response,
                data
            };
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
