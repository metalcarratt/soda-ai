import { describe, expect, test } from "vitest";
import { testSimilarity } from "./similarity-test.js";

describe('similarity test', () => {
    test('Greetings in English', async () => {
        const response = await testSimilarity({
            provided: 'Good morning',
            expected: "Hello"
        });
        // console.log(response);

        expect(response.data.result).toBe(true);
    });

    test('A word and a number', async () => {
        const response = await testSimilarity({
            provided: '9',
            expected: "dog"
        });
        // console.log(response);

        expect(response.data.result).toBe(false);
    });
}, 10000)