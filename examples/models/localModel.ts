import { ChatOllama } from "@langchain/ollama";
import type { Model } from "soda-ai";

const model = new ChatOllama({ model: "llama3:8b", temperature: 0 });

export const localModel: Model = {
    call: async (prompt: string) => {
        const response = await model.invoke(prompt);
        return `${response.content}`;
    }
}