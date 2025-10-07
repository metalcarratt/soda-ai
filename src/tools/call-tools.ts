import z from "zod";
import type { InputSchema, Model, OutputSchema, Signature } from "../core";
import { parseResponse } from "../core";
import type { DebugCollector } from '../debug-collector';
import { getToolingPrompt } from "./get-tooling-prompt";
import type { Tool } from "./types";

const MAX_LAYERS = 1;

const toolResponseSchema = z.object({
    finished: z.boolean(),
    call: z.string().optional(),
    args: z.record(z.any()).optional()
});

export const callTools = async <I extends InputSchema, O extends OutputSchema>(
    model: Model,
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: Tool<any, any>[],
    debugCollector: DebugCollector,
    toolContext: string = '',
    layers: number = 0
): Promise<string> => {
    const prompt = getToolingPrompt(signature, userInput, tools, toolContext);
    const layerCollector = debugCollector.createSubSection('Tooling layer ' + (layers + 1));
    layerCollector.collect('Tooling prompt', prompt);

    // 1. Call Model and ask what tool to call
    const response = await model.call(prompt);
    layerCollector.collect('Tooling response', response);

    const { finished, call, args } = parseResponse(response, toolResponseSchema);
    if (!finished) {
        // 2. Call tool
        layerCollector.collect('Tooling Args', JSON.stringify(args));

        const callTool = tools.find(tool => tool.name === call);
        const parsedArgs = callTool?.signature?.input?.parse(args ?? {});
        const context = callTool?.call(parsedArgs ?? {});

        // 3. Parse result
        // console.log('Result of calling tool', context);
        layerCollector.collect('Result of calling tool', JSON.stringify(context) ?? 'undefined');

        const newToolContext = `
${toolContext}
--- Tool: ${callTool?.name} ---
Input: ${JSON.stringify(parsedArgs)}
Output: ${JSON.stringify(context)}

        `;
        // console.log('New tool context', newToolContext);
        layerCollector.collect('New tool context', newToolContext);

        if (layers > MAX_LAYERS) {
            return newToolContext;
        } else {
            return callTools(model, signature, userInput, tools, debugCollector, newToolContext, layers + 1);
        }
    }

    return toolContext;
}



