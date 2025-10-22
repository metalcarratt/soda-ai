import { z } from "zod";
import type { InputSchema, OutputSchema, Signature } from "../core";
import type { ToolData } from "./types";
import { printCallsMade, printToolData } from "./tool-data";
import { printJson } from "../core/prompting/print-schema";

export const getToolingPrompt = <I extends InputSchema, O extends OutputSchema>(
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: ToolData<any, any>,
) => {

    const toolInstructions = printToolData(tools);

    const toolContext = printCallsMade(tools);

    const expectedOutputs = Object.keys(signature.outputs.shape).join(', ');
    // const providedInputs = Object.keys(signature.inputs.shape)
    //     .map(inputName => `- ${inputName}: ${userInput[inputName]}`)
    //     .join('\n');
    const providedInputs = printJson(userInput);

    return `
Your task is to help prepare the prompt for another model by reviewing what the
user wants, what context has been provided, and whether any tools need to be called
to get additional context. 

First review what the user has provided and is expecting below. Then look at what
context has already been provided by tooling. Finally look at the list of tools
and decide if you need to call another tool in order to get more context.

The user wants to ${signature.action} and is expecting to see ${expectedOutputs}.

Original user provided input:
'''
${providedInputs}
'''

Context provided by other tools (NOT user input):
'''
${toolContext}
'''

List of tools:
'''
${toolInstructions}
'''
You may only call tools listed in the “List of tools” section. Do not invent or call any tool not explicitly listed.
Only re-call deterministic tools if the input has changed. Non-deterministic tools may be re-called if the output is needed again.


To call a tool respond with exactly the following JSON format in triple quotes:
'''
{
  finished: false,
  call: tool name,
  args: [JSON object matching the tool's input schema]
}
'''

Or, if you think the context provided by other tools is sufficient, or if you beleive more context is needed but no tool is available
to provide it, respond with exactly the following format in triple quotes:
'''
{ finished: true }
'''
    `;
}
