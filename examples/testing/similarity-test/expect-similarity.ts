import { testSimilarity } from "./similarity-test";
import { expect } from 'vitest';

export const expectSimilarity = async (expected: string, provided?: string,) => {
    const response = await testSimilarity({
        provided: provided ?? '',
        expected
    });

    console.log(response);

    expect(response.data.result).toBe(true);
}