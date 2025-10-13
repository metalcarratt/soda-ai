# Providing more guidance

LLMs are a little unpredictable. Depending on how complex your logic is you may need to give some more help to guide it on the way.

As a rule of thumb, you should make functions as simple as possible. Don't do more than one task per function. If you need to do multiple things, create multiple functions and chain them together.

In addition to simplifying your expectations there are some other things you can do to improve your function:

## Give some examples

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

## Explain what your output means

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
