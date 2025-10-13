import z from "zod";
import { sortItemsTool } from "./sort-items-tool";
import { localModel } from "../../models/localModel";
import { soda } from "soda-ai";

const schema = {
    action: 'return the following list sorted in ascending order',
    inputs: z.object({
        items: z.array(z.number())
    }),
    outputs: z.object({
        sorted: z.array(z.number())
    }),
    tools: [sortItemsTool]
}

export const sortList = soda(localModel, schema);