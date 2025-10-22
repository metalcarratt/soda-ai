import z from "zod";
import { DebugCollector } from "../../debug-collector";
import { callModel } from "../call-model";
import { calculateInputTokens, calculatePromptTokens, countTokens } from './calculate-tokens';
import { InputSchema, Model, OutputSchema, Signature } from "../types";
import { createChunks } from "./create-chunks";

export const callModelChunked = async  <I extends InputSchema, O extends OutputSchema>(
    sig: Signature<I, O>,
    input: z.infer<I>,
    debug: boolean,
    debugCollector: DebugCollector,
    model: Model,
    examples?: { given: z.infer<I>, expect: z.infer<O>, incorrect?: string }[],
    toolContext?: string
) => {
    const chunkedDebugCollector = debugCollector.createSubSection('Call model chunked');

    const promptTokens = calculatePromptTokens(sig, input, examples, toolContext);
    // console.log('Prompt tokens without input', promptTokens);

    const { rawText, maxInputTokens, needToChunk, rawInputTokens } = calculateInputTokens(sig, input, promptTokens);

    const chunks = (needToChunk)
        ? createChunks(rawText, maxInputTokens)
        : [rawText];

    // console.log('number of chunks', chunks.length);
    const chunkedInputs = chunks.map(chunk => ({ ...input, [sig.chunking.input]: chunk }));
    chunkedDebugCollector.collect('Chunking stats',
        `Chunking strategy prompt limit: ${sig.chunking.promptLimit}
Prompt tokens without input: ${promptTokens}
Max allowed tokens for input: ${maxInputTokens}
Input original token length: ${rawInputTokens}
Need to chunk? ${needToChunk}
Chunks created: ${chunks.length}

All chunks: 

${chunkedInputs.map(chunk => JSON.stringify(chunk) + '\n\n')}`
    );

    let combinedData: z.infer<O>;


    for (const chunkedInput of chunkedInputs) {
        // console.log('-->-- chunk', chunkedInput);
        const data = await callModel(sig, chunkedInput, debug, chunkedDebugCollector, model, examples, toolContext);
        combinedData = sig.chunking.mergeFn(data, combinedData);
        // const chunkOutput = sig.chunking.output;
        // const existingOutput = combinedData[chunkOutput] ?? [];
        // const newOutput = data[chunkOutput];
        // console.log('new Output', newOutput);
        // combinedData = { ...data, [chunkOutput]: [...existingOutput, ...newOutput] };
    }

    return combinedData;
}