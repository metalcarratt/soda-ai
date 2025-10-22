# Soda AI - First Steps

## Define a model

The first thing is to define a model.

The Model type defines a single function that takes a prompt and returns a response. You can define whatever configuration inside you like (such as temperature). If you don't know how to define a model, just download one from Ollama and wrap it:

```ts
import { ChatOllama } from "@langchain/ollama";
import type { Model } from "soda-ai";

const model = new ChatOllama({ model: "llama3:8b", temperature: 0 });

export const myModel: Model = {
  call: async (prompt: string) => {
    const response = await model.invoke(prompt);
    return `${response.content}`;
  },
};
```

## Define a function

The next is to define a function.

A function is anything you'd like an AI to be able to do for you. Summarization? Classification? Natural language translation? Sentiment analysis? Problem solving and reasoning? First decide what you want your function to do. Then create a function like so:

```ts
import z from "zod";
import { soda } from "soda-ai";
import { myModel } from "./myModel";

const schema = {
  action: "translate the text into the given language",
  inputs: z.object({
    text: z.string(),
    language: z.string(),
  }),
  outputs: z.object({
    translation: z.string(),
  }),
};

export const translate = soda(myModel, schema);
```

The schema object above defines three important things:

- an `action` text. This will be feed to the LLM prompt as a high-level description of what it should do. You don't need to make it to verbose or fancy, but do make it clear and precise.
- `inputs`. This is a Zod object that defines what inputs your function should take. In this case it's text and language, both strings.
- `outputs`. Another Zod object that defines what outputs to expect. In this case a translation as a string.

Finally the function is created by passing in the model and the schema.

## Call it

The last thing is to call it.

This is the easiest part. Typscript makes sure the inputs and outputs all work, so to call it just run:

```ts
const response = await translate({
    text: '좋은 아침이에요',
    language: "English"
});

console.log(response.translation);

> Good morning!
```

And that's it!
