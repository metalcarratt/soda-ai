# Agentic AI

What's been covered so far is fine for simple usecases, but that alone wouldn't make Soda-Ai _Agentic_. To be Agentic we need to be able to call Tools. Think of a tool as some kind of external resource you want your function to be able to call _if it needs it_. It might be the ability to query an API, execute code or run a SQL query. It's up to you to decide what tools your function needs to do it's job.

Let's begin:

## Define a tool

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

## Create a function and pass in the tool

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
