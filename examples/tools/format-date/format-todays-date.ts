import z from "zod";
import { localModel } from "../../models/localModel.js";
import { soda } from "soda-ai";
import { dateTool } from "./date-tool.js";

const schema = {
    action: 'return today\'s date using the provided format',
    inputs: z.object({
        format: z.string()
    }),
    outputs: z.object({
        date: z.string()
    }),
    tools: [dateTool]
}

export const formatTodaysDate = soda(localModel, schema);