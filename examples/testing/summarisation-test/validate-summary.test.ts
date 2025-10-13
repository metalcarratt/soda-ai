import { describe, expect, test } from "vitest";
import { validateSummary } from "./validate-summary.js";

describe('validate the summary', () => {
    test('correct summary', async () => {
        const response = await validateSummary({
            summary: "offensive language",
            text: "You are really ugly"
        });
        // console.log(response);

        expect(response.data.result).toBe(true);
    });

    test('incorrect summary', async () => {
        const response = await validateSummary({
            summary: "offensive language",
            text: "My password is 1234"
        });
        console.log(response);

        expect(response.data.result).toBe(false);
    });
});