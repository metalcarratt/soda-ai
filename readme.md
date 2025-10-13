# Welcome to SODA-AI!

![Logo](./soda4.jpeg)

**Note: This is just a pet-project / PoC at the moment. If you find it useful, have suggestions for improvements, or want to help please reach out.**

SODA-AI stands for Schema Object Driven Agentic AI.

It's inspired by DSPy but focuses more on defining inputs and outputs via a Zod Schema than using Python Signatures.

The basic jist is, you shouldn't have to use natural language (which is brittle and open to interpretation) to make use of LLM's reasoning and problem solving abilities. So why not hide away all the prompt-generation mumbo jumbo behind solid schemas that define exactly what you want and how?

Also, it's all in TypeScript, so no need for Python knowledge to start your journey developing with Agentic AI!

The way I like to think of Soda-Ai is like writing a Docstring that briefly defines:

- what your function does
- what inputs it expects
- what outputs it expects

Except in real coding you can't just stop at a Docstring. You also have to write the code. With Soda-Ai, you don't!

## How it works

### Define a model

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

### Define a function

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

export const translateFn = soda(myModel, schema);
```

The schema object above defines three important things:

- an `action` text. This will be feed to the LLM prompt as a high-level description of what it should do. You don't need to make it to verbose or fancy, but do make it clear and precise.
- `inputs`. This is a Zod object that defines what inputs your function should take. In this case it's text and language, both strings.
- `outputs`. Another Zod object that defines what outputs to expect. In this case a translation as a string.

Finally the function is created by passing in the model and the schema.

### Call it

The last thing is to call it.

This is the easiest part. Typscript makes sure the inputs and outputs all work, so to call it just run:

```ts
const response = await translateFn({
    text: '좋은 아침이에요',
    language: "English"
});

console.log(response.data.translation);

> Good morning!
```

The response object contains three properties:

- `prompt` - the prompt SODA-AI generated for you (useful for debugging or fine-tuning your function)
- `raw` - the raw response from the AI model (again, useful if you didn't get expected results)
- `data` the actual data for you to consume.

And that's it!

## Making it better

LLms are a little unpredictable. Just doing the above may or may not be sufficient, depending on how complex your function is. As a rule of thumb, you should make functions as simple as possible. Don't do more than one task per function. If you need to do multiple things, create multiple functions and chain them together.

In addition to simplifying your expectations there are some other things you can do to improve your function:

### Give some examples

LLMs work really well when they are provided examples of how they are supposed to behave. Soda-Ai makes it really easy. Remember the translation function above? Here is it tuned with some translation examples:

```ts
const examples = [
  {
    given: {
      text: "Let's get something to eat",
      language: "Korean",
    },
    expect: {
      translation: "뭐 좀 먹자",
    },
  },
];

export const translateFn = soda(myModel, schema, examples);
```

This is useful because sometimes when translating to Asian languages the LLM may decide to use romanized output instead of the language's own script. The example above shows by example how the LLM should respond using characters.

For better results, use more examples, perhaps 2-3. If you have particular usecases, or see the LLM tripping up in particular ways, add an example for that usecase.

### Explain what your input/output means

Here's an example of en email checker, that checkes emails for bad content:

```ts
const schema = {
  action: `review the following email and check if it contains anything that could compromise the company's values. We don't want any of the following:
- rude language, definitely no swearing
- speaking anything bad about the CEO or other managers in the company
- revealing any trade secrets

While revealing personal information (such as passwords) does not compromise the company, it could be unsafe for the sender and we would like to flag it as a warning.
`,
  inputs: z.object({
    email: z.string(),
  }),
  outputs: z.object({
    safety: z
      .enum(["dangerous", "warning", "safe"])
      .describe(
        `'safe' means we can send the email to the recipient without further action. 'warning' means we can send it but we need to flag it to be reviewed by one of our staff. 'dangerous' means we absolutely should not send it`
      ),
    reason: z.string().describe("your reasoning for the safety labelling"),
  }),
};

export const checkEmail = soda(myModel, schema);
```

Here you can see the use of Zod's `describe` methods. Make use of these to provide further context to the LLM about what an output is intended to be. The prompt will make use of both the name, the type and the description to help guide the LLM toward giving you the response you expect.

## Agentic AI

The above is fine for simple usecases, but that alone wouldn't make Soda-Ai _Agentic_. To be Agentic we need to be able to call Tools. Think of a tool as some kind of external resource you want your function to be able to call _if it needs it_. It might be the ability to query an API, execute code or run a SQL query. It's up to you to decide what tools your function needs to do it's job.

Let's begin:

### Define a tool

Use the `createTool` function to easily define a new tool:

```ts
const dateTool = createTool({
  name: "getDate",
  instruct: "returns today's date",
  deterministic: true,
  call: () => `${new Date()}`,
});
```

The above tool returns today's date. If you try querying your model you may notice it doesn't know what today's date is. That's because it won't be in it's training data, which may be several years old. To get the correct date, it needs to call a tool.

The tool needs to provide:

- a `name`
- `instruct` - a brief description of what the tool does (so the model can decide if it wants to call it or not)
- `deterministic` - whether calling the tool with the same input will ever yield different results (in most cases probably deterministic is `true`, never returning different results. But if you have a random number generator, that would be `false`)
- `call` - the function to call when the tool is invoked. By default the tool call takes no arguments and returns a string. If this is what your are doing, this will be enough.

```ts
const sortItemsTool = createTool({
    name: 'sortItems',
    instruct: 'sorts items in ascending order',
    deterministic: true,
    signature: {
        input: z.object({
            items: z.array(z.number())
        }),
        output: z.array(z.number())
    },
    call: ({items}) => items.sort((a, b) => a - b);
});
```

This tool also defines a `signature` which is which inputs and outputs the tool call should take and return. In this case it accepts an `items`, which is an array of numbers, and return an array of numbers as it's output.

### Create a function and pass in the tool

Now to use the tool, just include it when you create your function, like so:

```ts
const schema = {
  action: "return today's date using the provided format",
  inputs: z.object({
    format: z.string(),
  }),
  outputs: z.object({
    date: z.string(),
  }),
  tools: [dateTool],
};

export const formatTodaysDate = soda(myModel, schema);
```

This will pass the `dateTool` tool to the `formatTodaysDate` function. Then a user can call it like so:

```ts
const response = await formatTodaysDate({ format: "DD/MM/YYYY" });
console.log(response);
```

And they will get today's date correctly formatted.

## Function chaining and branching

TBD

## Examples:

See [examples](./examples/readme.md)
