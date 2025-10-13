import z from "zod";
import { localModel } from "../../models/localModel";
import { soda } from "soda-ai";
import { expect } from 'vitest';

export const schema = {
    action: 'confirm whether the summary matches the text or not',
    inputs: z.object({
        summary: z.string(),
        text: z.string()
    }),
    outputs: z.object({
        result: z.boolean(),
        rationale: z.string()
    }),
}

const examples = [{
    given: {
        summary: 'offensive language',
        text: 'You are so stupid'
    },
    expect: {
        result: false,
        rationale: 'stupid is an offensive word'
    }
}]

export const validateSummary = soda(localModel, schema, examples);

export const expectValidSummary = async (summary: string, text: string) => {
    expect((await validateSummary({
        summary,
        text
    })).data.result).toBe(true);
}