import { z } from "zod";
import type { ZodObject, ZodTypeAny } from "zod";
import type { InputSchema, OutputSchema, Signature } from "../core";
import type { ToolData } from "./types";
import { zodToJsonSchema } from "zod-to-json-schema";
import { printCallsMade, printToolData } from "./tool-data";

export const getToolingPrompt = <I extends InputSchema, O extends OutputSchema>(
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: ToolData<any, any>,
) => {
    // const toolInstructions = tools.tools.map(tool => {
    //     const schema = tool.signature?.input;
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     const schemaText = schema ? printInputSchema(schema as ZodObject<any>) : '  • (no input)';
    //     const determinsticText = `Deterministic: ${tool.deterministic}`;
    //     return `- ${tool.name}: ${tool.instruct}\n${schemaText}\n${determinsticText}`;
    // });

    const toolInstructions = printToolData(tools);

    const toolContext = printCallsMade(tools);

    const expectedOutputs = Object.keys(signature.outputs.shape).join(', ');
    const providedInputs = Object.keys(signature.inputs.shape)
        .map(inputName => `- ${inputName}: ${userInput[inputName]}`)
        .join('\n')

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


To call a tool respond with exactly the following format in triple quotes:
'''
Finished: False
Call: [tool name]
Args: [JSON object matching the tool's input schema]
'''

Or, if you think the context provided by other tools is sufficient, or if you beleive more context is needed but no tool is available
to provide it, respond with exactly the following format in triple quotes:
'''
Finished: True
'''
    `;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const printInputSchema = (schema: ZodObject<any>) => {
    const shape = schema.shape;
    return Object.entries(shape)
        .map(([key, value]) => {
            const zodType = value as ZodTypeAny;
            const typeName = getTypeName(zodType);
            const desc = zodType.description ? ` - ${zodType.description}` : '';
            return `  • ${key}: ${typeName}${desc}`;
        })
        .join('\n');
};

const getTypeName = (zodType: ZodTypeAny) => {
    return JSON.stringify(zodToJsonSchema(zodType));
    // const typeName = zodType._def.typeName;
    // if (typeName === '')
    // if (typeName === 'ZodArray') {
    //     return `array of ${(zodType as ZodArray<any>).element}`;
    // }
    // return typeName;
}