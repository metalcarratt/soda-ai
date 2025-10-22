import { testSimilarity } from "./similarity-test";
import { expect } from 'vitest';

export const expectSimilarity = async (expected: string, provided?: string,) => {
    const { result } = await testSimilarity({
        provided: provided ?? '',
        expected
    });

    // console.log(result);

    expect(result).toBe(true);
}