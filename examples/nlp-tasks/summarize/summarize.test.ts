import { describe, expect, test } from "vitest";
import { countWords } from "../../util/test-helper";
import { text } from "../common/abraham-lincoln-text";
import { summarize } from "./summarize";

describe('summarize', () => {
    test('summarize in fifty words or less', async () => {
        const { summary } = await summarize({ text, wordCount: 50 });

        const wordCount = countWords(summary);
        // console.log('summary', summary);
        // console.log('word count', wordCount);
        expect(wordCount).toBeLessThanOrEqual(50);
    });

    test('summarize in ten words or less', async () => {
        const { summary } = await summarize({ text, wordCount: 10 });

        const wordCount = countWords(summary);
        // console.log('summary', summary);
        // console.log('word count', wordCount);
        expect(wordCount).toBeLessThanOrEqual(10);
    });
}, 10000);
