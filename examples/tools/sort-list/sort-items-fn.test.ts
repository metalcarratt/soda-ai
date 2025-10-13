import { describe, expect, test } from "vitest";
import { sortList } from "./sort-items-fn.js";


describe.only('sort list', () => {
    test('sort three items', async () => {
        const response = await sortList({ items: [3, 2, 1] });
        // console.log(response);

        expect(response.data.sorted).toStrictEqual([1, 2, 3]);
    });
}, 20000);

