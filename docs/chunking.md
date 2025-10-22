# Chunking

If you pass in an input that is too long you may run out of tokens or, even if you don't, the quality of your output can
degrade. If your input contains long text that can be broken into pieces, Soda AI allows a way for you to chunk the input
into pieces so that you can process each chunk at a time, and collate the results at the end.

Here's an example of chunking:

```ts
const outputs = z.object({
  entities: z.array(
    z.object({
      entity: z.string(),
      type: z
        .enum(["Person", "Organization", "Location", "Date", "Other"])
        .describe("categorization of the entity"),
    })
  ),
});

const schema = {
  action: "extract all named entities from the provided text",
  inputs: z.object({
    text: z.string(),
  }),
  outputs,
  chunking: {
    input: "text",
    promptLimit: 800,
    mergeFn: (
      current: z.infer<typeof outputs>,
      previous?: z.infer<typeof outputs>
    ) => {
      const combinedEntities = [
        ...(previous?.entities ?? []),
        ...current.entities,
      ];
      const deduped = Array.from(
        new Map(
          combinedEntities.map((entity) => [entity.entity, entity])
        ).values()
      );
      return { entities: deduped };
    },
  },
};
```

The `chunking` option takes three properties, `input`, `promptLimit` and `mergeFn`.

- `input` is the name of
  the input field that you want to chunk. You can only chose one. There is no type safety on this name so spell
  it correctly, please.

- `promptLimit` is your standard for an acceptable prompt limit in tokens. In the example above 800 tokens
  is the acceptable limit (normally about 1000 is good maximum, but you can make it smaller to increase chunking
  and aim for better results). Soda AI will calculate your prompt length _without_ the chunked input field,
  infer the maximum length the input field can be, and then chunk the input based on the result. For example,
  if the prompt was 300 tokens and the promptLimit is 800 tokens, then your input can be 500 tokens before it
  needs to be chunked. If your input is 1000 tokens, it will need to be chunked in to two parts.

- `mergeFn` a function to merge the result data for multiple chunks. In the example above we first combine the
  two `entities` arrays, and then remove duplicates.
