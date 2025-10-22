import { countTokens } from './calculate-tokens';
export const createChunks = (
    text: string,
    maxTokens: number
): string[] => {
    const paragraphs = splitIntoParagraphs(text);
    // console.log('paragraphs', paragraphs);
    return chunkParagraphs(paragraphs, maxTokens);
};

export const splitIntoParagraphs = (text: string): string[] => {
    return text.split(/(?:\r?\n\s*\r?\n)+/).map(p => p.trim()).filter(Boolean);
}

export const chunkParagraphs = (paragraphs: string[], maxTokens: number): string[] => {
    const chunks: string[] = [];
    let buffer: string[] = [];
    let bufferTokens = 0;

    for (const para of paragraphs) {
        const paraTokens = countTokens(para);

        if (paraTokens <= maxTokens) {
            if (bufferTokens + paraTokens <= maxTokens) {
                buffer.push(para);
                bufferTokens += paraTokens;
            } else {
                if (buffer.length) {
                    chunks.push(buffer.join('\n\n').trim());
                }
                buffer = [para];
                bufferTokens = paraTokens;
            }
        } else {
            if (buffer.length) {
                chunks.push(buffer.join('\n\n').trim());
                buffer = [];
                bufferTokens = 0;
            }

            const sentences = splitIntoSentences(para);
            chunks.push(...chunkSentences(sentences, maxTokens));
        }
    }

    if (buffer.length) {
        chunks.push(buffer.join('\n\n').trim());
    }

    return chunks;
};

export const splitIntoSentences = (text: string): string[] => {
    const matches = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|[^.!?]+$/g);
    return matches?.map(s => s.trim()).filter(Boolean) ?? [];
}

export const chunkSentences = (sentences: string[], maxTokens: number): string[] => {
    const chunks: string[] = [];
    let buffer: string[] = [];
    let bufferTokens = 0;

    for (const sentence of sentences) {
        const t = countTokens(sentence);
        if (bufferTokens + t > maxTokens && buffer.length) {
            chunks.push(buffer.join(' ').trim());
            buffer = [sentence];
            bufferTokens = t;
        } else {
            buffer.push(sentence);
            bufferTokens += t;
        }
    }

    if (buffer.length) {
        chunks.push(buffer.join(' ').trim());
    }

    return chunks;
};