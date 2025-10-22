import { soda } from "soda-ai";
import z from "zod";
import { localModel } from "../../models/localModel";

const schema = {
    action: 'return a coreference chain for the given named entity in the given text',
    rules: [
        'Resolve all pronouns and possessive references (e.g., "he", "his", "him"), aliases, and indirect references to the entity, even if they are ambigious or indirect. Do not rely soley on exact string matches',
        'Include all aliases, title, and role-based references to the entity, even if they don\'t include the entity\'s name'
    ],
    inputs: z.object({
        entity: z.string(),
        text: z.string()
    }),
    outputs: z.object({
        entity: z.string(),
        mentions: z.array(z.object({
            text: z.string().describe('exact text of the mention found'),
            start: z.number().describe('start index of the occurance of this mention'),
            end: z.number().describe('end index of the occurance of this mention')
        })).describe('all references to the entity, including third person pronouns or official titles')
    })
}

const examples = [{
    given: {
        text: 'Marie Curie is famous. She discovered radium',
        entity: 'Marie'
    },
    expect: {
        entity: 'Marie Curie',
        mentions: [{
            text: 'Marie Curie',
            start: 0,
            end: 11
        }, {
            text: 'She',
            start: 23,
            end: 26
        }]
    }
}]

export const resolveCoreferences = soda(localModel, schema, examples);