import { describe, test } from "vitest";
import { translateFn } from "./translate-fn";
import { expectSimilarity } from "../../testing/similarity-test/expect-similarity";

describe('translate language', () => {
    test('Korean to English', async () => {
        const { translation } = await translateFn({
            text: '좋은 아침이에요',
            language: "English"
        });
        // console.log(translation);

        await expectSimilarity('Good morning', translation);
    });

    test('English to Chinese', async () => {
        const { translation } = await translateFn({
            text: 'Good morning',
            language: "Chinese"
        }, { debug: true });
        // console.log(translation);

        await expectSimilarity('早上好', translation);
    });
}, 10000);

