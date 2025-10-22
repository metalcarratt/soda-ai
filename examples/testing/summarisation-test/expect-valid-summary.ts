import { validateSummary } from "./validate-summary";
import { expect } from 'vitest';

export const expectValidSummary = async (summary: string, text: string) => {
    expect((await validateSummary({
        summary,
        text
    })).result).toBe(true);
}