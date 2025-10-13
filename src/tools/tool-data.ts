import zodToJsonSchema from "zod-to-json-schema";
import { Tool, ToolData } from "./types";

export const createToolData = (tools: Tool<any, any>[]): ToolData<any, any> => {
    return {
        tools,
        callsMade: []
    };
}

export const printToolData = (toolData: ToolData<any, any>) => {
    const tools = toolData.tools.map(tool => ({
        toolName: tool.name,
        arguments: parseAndCleanArguments(tool.signature.input),
        returnType: parseAndCleanReturnType(tool.signature.output),
        deterministic: tool.deterministic,
        // callsMade: tool.calls
    }));
    return JSON.stringify(tools, null, 2);
}

export const printCallsMade = (toolData: ToolData<any, any>) => {
    return JSON.stringify({ callsMade: toolData.callsMade }, null, 2);
}

const parseAndCleanArguments = (input: any) => {
    const args = zodToJsonSchema(input);
    delete (args as any).$schema;
    delete (args as any).additionalProperties;

    if (!args?.description) {
        if (isJsonSchemaObjectType(args) && Object.keys(args.properties).length === 0) {
            args.description = "This tool takes no arguments.";
        } else {
            args.description = "Input parameters for the tool.";
        }
    }
    return args;
}

function isJsonSchemaObjectType(schema: any): schema is { type: "object"; properties: Record<string, any> } {
    return typeof schema === "object" &&
        schema !== null &&
        schema.type === "object" &&
        typeof schema.properties === "object";
}

const parseAndCleanReturnType = (output: any) => {
    const returnType = zodToJsonSchema(output);

    if (returnType.$schema) delete returnType.$schema;

    if (!returnType?.description) {
        returnType.description = "Output returned by the tool.";
    }

    return returnType;
}
