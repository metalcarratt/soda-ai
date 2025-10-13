import { ChatOllama } from "@langchain/ollama";
import type { Model } from "soda-ai";

const model = new ChatOllama({ model: "llama3:8b", temperature: 0 });

export const localModel: Model = {
    call: async (prompt: string) => {
        // console.log('call start');
        const response = await model.invoke(prompt);
        const content = `${response.content}`;
        // console.log('call end');
        return content;
    }
}