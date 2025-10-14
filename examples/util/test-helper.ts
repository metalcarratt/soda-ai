import { expect } from 'vitest';

export const expectResponseKeys = (data: Object, keys: string[]) => {
    expect(Object.keys(data), `data object to contain keys: ${keys}`).toEqual(expect.arrayContaining(keys));
}

export const countWords = (text: string) => {
    if (text.trim() === '') return 0;

    return text.trim().split(/\s+/).length;
}