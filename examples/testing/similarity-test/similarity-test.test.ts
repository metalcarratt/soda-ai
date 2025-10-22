import { describe, expect, test } from "vitest";
import { testSimilarity } from "./similarity-test.js";

describe('similarity test', () => {
    test('Greetings in English', async () => {
        const { result } = await testSimilarity({
            provided: 'Good morning',
            expected: "Hello"
        });
        // console.log(result);

        expect(result).toBe(true);
    });

    test('A word and a number', async () => {
        const { result } = await testSimilarity({
            provided: '9',
            expected: "dog"
        });
        // console.log(result);

        expect(result).toBe(false);
    });
}, 10000)