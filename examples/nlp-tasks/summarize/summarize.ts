import { soda } from "soda-ai";
import z from "zod";
import { localModel } from "../../models/localModel";

const schema = {
    action: 'summarize the provided text within the specified word count limit',
    rules: [
        'Do no exceed the word count limit'
    ],
    inputs: z.object({
        text: z.string(),
        wordCount: z.number()
    }),
    outputs: z.object({
        summary: z.string().describe('a summary less than {wordCount} words')
    })
}

export const summarize = soda(localModel, schema);