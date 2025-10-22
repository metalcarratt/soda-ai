import z from "zod";
import { localModel } from "../../models/localModel";
import { soda } from "soda-ai";

export const schema = {
    action: 'confirm whether the summary matches the text or not',
    inputs: z.object({
        summary: z.string(),
        text: z.string()
    }),
    outputs: z.object({
        result: z.boolean(),
        rationale: z.string(),
    }),
}

const examples = [{
    given: {
        summary: 'offensive language',
        text: 'You are so stupid'
    },
    expect: {
        result: true,
        rationale: 'stupid is an offensive word',
    }
}, {
    given: {
        summary: 'offensive language',
        text: 'I like eating noodles'
    },
    expect: {
        result: false,
        rationale: 'the summary is not related to the provided text',
    }
}]

export const validateSummary = soda(localModel, schema, examples);
