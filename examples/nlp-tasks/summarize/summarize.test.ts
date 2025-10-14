import { describe, expect, test } from "vitest";
import { countWords, expectResponseKeys } from "../../util/test-helper";
import { text } from "../common/abraham-lincoln-text";
import { summarize } from "./summarize";

describe('summarize', () => {
    test('summarize in fifty words or less', async () => {
        const response = await summarize({ text, wordCount: 50 });

        expectResponseKeys(response.data, ['summary']);
        const wordCount = countWords(response.data.summary);
        // console.log('summary', response.data.summary);
        // console.log('word count', wordCount);
        expect(wordCount).toBeLessThanOrEqual(50);
    });

    test('summarize in ten words or less', async () => {
        const response = await summarize({ text, wordCount: 10 }, { debug: true });

        expectResponseKeys(response.data, ['summary']);
        const wordCount = countWords(response.data.summary);
        // console.log('summary', response.data.summary);
        // console.log('word count', wordCount);
        expect(wordCount).toBeLessThanOrEqual(10);
    });
}, 10000);
