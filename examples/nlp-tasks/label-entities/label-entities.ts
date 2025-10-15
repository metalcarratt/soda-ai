import { soda } from "soda-ai";
import z from "zod";
import { localModel } from "../../models/localModel";

const schema = {
    action: 'extract all named entities from the provided text',
    inputs: z.object({
        text: z.string()
    }),
    outputs: z.object({
        entities: z.array(z.object({
            entity: z.string(),
            type: z.enum(['Person', 'Organization', 'Location', 'Date', 'Other']).describe('categorization of the entity')
        }))
    })
}

export const labelEntities = soda(localModel, schema);