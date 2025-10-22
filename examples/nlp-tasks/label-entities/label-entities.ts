import { soda } from "soda-ai";
import z from "zod";
import { localModel } from "../../models/localModel";

const outputs = z.object({
    entities: z.array(z.object({
        entity: z.string(),
        type: z.enum(['Person', 'Organization', 'Location', 'Date', 'Other']).describe('categorization of the entity')
    }))
});

const schema = {
    action: 'extract all named entities from the provided text',
    inputs: z.object({
        text: z.string()
    }),
    outputs,
    chunking: {
        input: 'text',
        promptLimit: 800,
        mergeFn: (current: z.infer<typeof outputs>, previous?: z.infer<typeof outputs>) => {
            const combinedEntities = [...(previous?.entities ?? []), ...current.entities];
            const deduped = Array.from(
                new Map(combinedEntities.map(entity => [entity.entity, entity])).values()
            );
            return { entities: deduped }
        }
    }
}

export const labelEntities = soda(localModel, schema);