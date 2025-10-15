import type z from "zod";
import type { OutputSchema } from "./types";
import JSON5 from 'json5';

export const parseResponse = <O extends OutputSchema>(
    response: string,
    outputSignature: O
): z.infer<O> => {
    const asJson = extractJsonFromText(response, outputSignature);
    return outputSignature.parse(asJson);
}

function extractJsonFromText<O extends OutputSchema>(text: string, outputSignature: O): any | null {
    const jsonBlocks = extractJsonBlocks(text);

    for (const jsonBlock of jsonBlocks) {
        try {
            return outputSignature.parse(jsonBlock);
        } catch (err) { }
    }

    throw new Error('No JSON block matching schema found');
}

export function extractJsonBlocks(text: string): object[] {
    const blocks: object[] = [];
    let depth = 0;
    let buffer = '';
    let inBlock = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '{') {
            if (!inBlock) {
                inBlock = true;
                buffer = '';
            }
            depth++;
        }

        if (inBlock) buffer += char;

        if (char === '}') {
            depth--;
            if (depth === 0 && inBlock) {
                try {
                    const parsed = JSON5.parse(buffer);
                    blocks.push(parsed);
                } catch {
                    // skip invalid JSON
                }
                inBlock = false;
                buffer = '';
            }
        }
    }

    return blocks;
}
