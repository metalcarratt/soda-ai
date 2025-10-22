import { escapeNewlinesInStrings, extractJsonBlocks } from "./parse-response";
import { expect, describe, test } from 'vitest';

describe('escapeNewlinesInStrings', () => {
    test('escape mulitple new lines', () => {
        const result = escapeNewlinesInStrings(`{text: "This has
a new line
and another"}`);

        expect(result).toStrictEqual('{text: "This has\\na new line\\nand another"}');
    });

    test('new line at the beginning of the string', () => {
        const result = escapeNewlinesInStrings(`{text: "
An awkwardly placed new-line."}`);

        expect(result).toStrictEqual('{text: "\\nAn awkwardly placed new-line."}');
    });

    test('multiple new lines in a row', () => {
        const result = escapeNewlinesInStrings(`{text: "One paragraph, and...

another."}`);

        expect(result).toStrictEqual('{text: "One paragraph, and...\\n\\nanother."}');
    });
});

describe('extractJsonBlocks', () => {
    test('two embedded blocks extracted', () => {
        const blocks = extractJsonBlocks(`This is random text and now {key: 'value'} that was a json block and another is {result: 4, other: false} this.`);

        expect(blocks[0]['key']).toBe('value');
        expect(blocks[1]['result']).toBe(4);
        expect(blocks[1]['other']).toBe(false);
    })
});