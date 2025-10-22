import { describe, expect, test } from "vitest";
import { numberQuestionFn } from "./number-question-fn";

describe('answer with a number', () => {
    test('cats in a litter', async () => {
        const question = "How many cats are in a typical litter?";
        const { answer } = await numberQuestionFn({ question });
        // console.log(response);

        expect(typeof answer, 'answer to be a number').toBe('number');
    });

    test('simple maths', async () => {
        const { answer } = await numberQuestionFn({ question: "What is 4+5?" });
        // console.log(response);

        expect(typeof answer).toBe('number');
        expect(answer).toBe(9);
    })
}, 10000);

