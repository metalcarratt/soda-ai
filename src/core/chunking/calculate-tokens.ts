import z from "zod";
import { InputSchema, OutputSchema, Signature } from "../types";
import { createPrompt } from "../prompting/create-prompt";
import { encoding_for_model } from "tiktoken";

const enc = encoding_for_model('gpt-3.5-turbo');

export const countTokens = (text: string) => enc.encode(text).length;

export const calculatePromptTokens = <I extends InputSchema, O extends OutputSchema>(
    signature: Signature<I, O>,
    userInput: z.infer<I>,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],
    toolContext?: string,
) => {
    const clonedUserInput = { ...userInput } as Record<string, unknown>;
    clonedUserInput[signature.chunking.input] = '';

    const promptDryRun = createPrompt(signature, clonedUserInput, examples, toolContext);

    return countTokens(promptDryRun);
}

export const calculateInputTokens = <I extends InputSchema, O extends OutputSchema>(
    sig: Signature<I, O>,
    input: z.infer<I>,
    promptTokens: number
) => {
    const inputKey = sig.chunking?.input;
    if (!inputKey) return { rawText: '', maxInputTokens: 0, needToChunk: false };

    const rawText = input[inputKey] as string;
    const maxInputTokens = sig.chunking.promptLimit - promptTokens;
    // console.log('max input tokens', maxInputTokens);
    const rawInputTokens = countTokens(rawText);
    // console.log('length of raw input', rawInputTokens);

    const needToChunk = (rawInputTokens > maxInputTokens);
    // if (!needToChunk) {
    //     console.log('input is less than max tokens, no need to chunk');
    // }

    return { rawText, maxInputTokens, needToChunk, rawInputTokens }
}