import { expect, describe, test } from 'vitest';
import { chunkParagraphs, chunkSentences, createChunks, splitIntoParagraphs, splitIntoSentences } from './create-chunks';

describe('splitIntoParagraphs', () => {
    test('base', () => {
        const result = splitIntoParagraphs(`Paragraph One.

Paragraph Two.`);

        expect(result.length).toBe(2);
        expect(result[0]).toStrictEqual('Paragraph One.');
        expect(result[1]).toStrictEqual('Paragraph Two.');
    });

    test('single new line not a new paragraph', () => {
        const result = splitIntoParagraphs(`Line One.
Line Two.`);

        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(`Line One.
Line Two.`);
    });

    test('one paragraph', () => {
        const result = splitIntoParagraphs(`Only me`);

        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(`Only me`);
    });

    test('test paragraphs separated by white space', () => {
        const paragraphs = splitIntoParagraphs(`This is.
            
A number of. Smaller sentences. Put together. To make one. Larger body of text.`);

        expect(paragraphs).toStrictEqual(['This is.', 'A number of. Smaller sentences. Put together. To make one. Larger body of text.']);
    });
});

describe('splitIntoSentences', () => {
    test('base', () => {
        const result = splitIntoSentences(`Sentence One. Sentence Two.`);

        expect(result.length).toBe(2);
        expect(result[0]).toStrictEqual('Sentence One.');
        expect(result[1]).toStrictEqual('Sentence Two.');
    });

    test('different delimiters', () => {
        const result = splitIntoSentences(`Sentence One! Sentence Two? Sentence Three.`);

        expect(result.length).toBe(3);
        expect(result[0]).toStrictEqual('Sentence One!');
        expect(result[1]).toStrictEqual('Sentence Two?');
        expect(result[2]).toStrictEqual('Sentence Three.');
    });

    test('one sentence', () => {
        const result = splitIntoSentences(`only me`);

        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(`only me`);
    });

    test('one sentence', () => {
        const result = splitIntoSentences(`only me`);

        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(`only me`);
    })
});

describe('createChunks', () => {
    test('chunk four short sentences into two chunks', () => {
        const chunks = createChunks('This is. A number of. Smaller sentences. Put together.', 10);

        expect(chunks).toStrictEqual(['This is. A number of.', 'Smaller sentences. Put together.']);
    });

    test('chunk by paragraphs first', () => {
        const chunks = createChunks(`This is. A number of.

Smaller sentences. Put together.`, 10);

        expect(chunks).toStrictEqual(['This is. A number of.', 'Smaller sentences. Put together.']);
    });

    test('keep two smaller paragraphs in the same chunk', () => {
        const chunks = createChunks(`This is.

A number of.`, 10);

        expect(chunks).toStrictEqual([`This is.

A number of.`]);
    });

    test('chunk longer paragraphs', () => {
        const chunks = createChunks(`This is. A number of.

Smaller sentences. Put together. To make one. Larger body of text.`, 10);

        expect(chunks).toStrictEqual(['This is. A number of.', 'Smaller sentences. Put together.', 'To make one. Larger body of text.']);
    });

    test('smaller paragraphs do not break longer paragraphs', () => {
        const chunks = createChunks(`This is.
            
A number of. Smaller sentences. Put together. To make one. Larger body of text.`, 10);

        expect(chunks).toStrictEqual(['This is.', 'A number of. Smaller sentences.', 'Put together. To make one.', 'Larger body of text.']);
    });
});

describe.skip('chunkSentences', () => {
    // [1, 1, 1, 1] => [4]
    test('chunk smaller sentences', () => {
        const chunks = chunkSentences(['These', 'sentences', 'belong', 'together.'], 10);
        expect(chunks[0]).toStrictEqual('These sentences belong together.');
    });

    // [3, 10, 2] => [3, 10, 2]
    test('don\'t chunk larger sentences', () => {
        const chunks = chunkSentences(['This is small.', 'But this is quite big so keep it all together.', 'Small again.'], 10);
        expect(chunks).toStrictEqual(['This is small.', 'But this is quite big so keep it all together.', 'Small again.']);
    });

    // [1, 2, 10] > [3, 10]
    test('chunk and don\'t chunk', () => {
        const chunks = chunkSentences(['This', 'is small.', 'But this is quite big so keep it all together.'], 10);
        expect(chunks).toStrictEqual(['This is small.', 'But this is quite big so keep it all together.']);
    })
});

describe('chunkParagraphs', () => {
    test('chunk smaller paragraphs', () => {
        const chunks = chunkParagraphs(['These', 'paragraphs', 'belong', 'together.'], 10);

        expect(chunks[0]).toStrictEqual('These\n\nparagraphs\n\nbelong\n\ntogether.');
    });

    test('don\'t chunk larger paragraphs', () => {
        const chunks = chunkParagraphs(['This is small.', 'But this is quite big so keep it all together.', 'Small again.'], 10);

        expect(chunks).toStrictEqual(['This is small.', 'But this is quite big so keep it all together.', 'Small again.']);
    });

    test('break up longer paragraphs', () => {
        const chunks = chunkParagraphs(['This is small. But this is quite big so keep it all together.'], 10);

        expect(chunks).toStrictEqual(['This is small.', 'But this is quite big so keep it all together.']);
    });

    test('chunk and break', () => {
        const chunks = chunkParagraphs(['This', 'is', 'small.', 'But this is quite big so keep it all together. Small again.'], 10);

        expect(chunks).toStrictEqual(['This\n\nis\n\nsmall.', 'But this is quite big so keep it all together.', 'Small again.']);
    });

    test('don\'t mix half paragraphs', () => {
        const chunks = chunkParagraphs(['This is', 'small. But this is quite big so keep it all together.'], 10);
        expect(chunks).toStrictEqual(['This is', 'small.', 'But this is quite big so keep it all together.']);
    });
});