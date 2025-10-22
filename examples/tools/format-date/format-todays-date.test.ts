import { describe, expect, test } from "vitest";
import { formatTodaysDate } from "./format-todays-date.js";


describe('format todays date', () => {
    test('nz format', async () => {
        const { date } = await formatTodaysDate({ format: 'DD/MM/YYYY' });
        // console.log(response);

        expect(date).toBe(formatDdMmYyyy());
    });

    test('year first', async () => {
        const { date } = await formatTodaysDate({ format: 'YYYY/MM/DD' });
        // console.log(response);

        expect(date).toBe(formatYyyyMmDd());
    });
}, 20000);

const formatDdMmYyyy = () => {
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const yyyy = today.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
}

const formatYyyyMmDd = () => {
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const yyyy = today.getFullYear();

    return `${yyyy}/${mm}/${dd}`;
}