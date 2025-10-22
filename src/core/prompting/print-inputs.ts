import type z from "zod";
import type { InputSchema, OutputSchema } from "../types";
import { printJson } from "./print-schema";

export const printInputs = <I extends InputSchema, O extends OutputSchema>(
    userInput: z.infer<I>
) => {
    const listOfInputs = printJson(userInput);

    return `
\`\`\`json
${listOfInputs}
\`\`\`
    `;
}
