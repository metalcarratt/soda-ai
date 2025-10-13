import { createTool } from "soda-ai";
import z from "zod";

export const sortItemsTool = createTool({
    name: 'sortItems',
    instruct: 'sorts items in ascending order',
    deterministic: true,
    signature: {
        input: z.object({
            items: z.array(z.number())
        }),
        output: z.array(z.number())
    },
    call: ({ items }) => items.sort((a, b) => a - b)
});