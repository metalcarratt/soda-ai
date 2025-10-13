import { z } from 'zod';
import { localModel } from '../../models/localModel';
import { soda } from 'soda-ai';

const schema = {
    action: 'confirm whether the provided value has a **similar communicative intent** to the expected value.',
    rules: [
        'Do not analyse tone, formality or time-specific context.',
        'Focus only on whether the two expression serve the same **basic conversational purpose**.'
    ],
    inputs: z.object({
        provided: z.string(),
        expected: z.string()
    }),
    outputs: z.object({
        result: z.boolean(),
        rationale: z.string()
    })
}

const examples = [{
    given: {
        provided: 'Goodbye',
        expected: 'See you later'
    },
    expect: {
        result: true,
        rationale: 'They are both ways to say farewell to someone'
    }
}, {
    given: {
        provided: 'Good morning',
        expected: 'Hi'
    },
    expect: {
        result: true,
        rationale: 'They are both ways to say greet someone'
    }
}]

export const testSimilarity = soda(localModel, schema, examples);
