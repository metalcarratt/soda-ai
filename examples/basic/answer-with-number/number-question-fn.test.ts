import { describe, expect, test } from "vitest";
import { numberQuestionFn } from "./number-question-fn";
import { expectResponseKeys } from "../../util/test-helper";

describe('answer with a number', () => {
    test('cats in a litter', async () => {
        const question = "How many cats are in a typical litter?";
        const response = await numberQuestionFn({ question });
        // console.log(response);

        expectResponseKeys(response.data, ['answer', 'reason']);
        expect(typeof response.data.answer, 'answer to be a number').toBe('number');
    });

    test('simple maths', async () => {
        const response = await numberQuestionFn({ question: "What is 4+5?" });
        // console.log(response);

        expectResponseKeys(response.data, ['answer', 'reason']);
        expect(typeof response.data.answer).toBe('number');
        expect(response.data.answer).toBe(9);
    })
}, 10000);

