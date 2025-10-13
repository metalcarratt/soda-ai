import { expect } from 'vitest';

export const expectResponseKeys = (data: Object, keys: string[]) => {
    expect(Object.keys(data), `data object to contain keys: ${keys}`).toEqual(expect.arrayContaining(keys));
}