# Examples

## Translate language

Translate a text from one language to another

```ts
const response = await translateFn({
  text: "Good morning",
  language: "Chinese",
});

response.data.translation; // 早上好
```

Shows:

- input / output
- use of examples

See:

- [Definition](./basic/translate-language/translate-fn.ts)
- [Usage](./basic/translate-language/index.ts)

## Answer with number

Ask a question that expects a number as a response

```ts
const question = "How many cats are in a typical litter?";
const response = await numberQuestionFn({ question });

response.data.answer; // 3.1
```

Shows:

- inputs and outputs
- get output as a number
- use examples to improve prompt

See:

- [Definition](./basic/answer-with-number/number-question-fn.ts)
- [Usage](./basic/answer-with-number/index.ts)

## Email checker

Check an email for inappropriate content (imagine this as part of an email ingest/egress system)

```ts
const email = "Hi Bob, I've got the stuff. Sending it through now.";
const response = await checkEmailFn({ email });

response.data.safety === "safe"; // true
```

Shows:

- get output as an enum
- use describe to improve prompt

See:

- [Definition](./basic/email-checker/check-email-fn.ts)
- [Usage](./basic/email-checker/index.ts)

## Format date

Gets today's date and formats it according to the user's format instructions

```ts
const response = await formatTodaysDate({ format: "DD/MM/YYYY" });

response.data.date; // 08/10/2025
```

Shows:

- a tool that uses the default schema
- using the tool

Shows:

- [Date tool](./tools/format-date/date-tool.ts)
- [Definition](./tools/format-date/format-todays-date.ts)
- [Usage](./tools/format-date/index.ts)

## Sort items

Sorts a list of numbers

```ts
const unsortedList = [9, 5, 7, 21, 64, 8, 2];
const response = await sortList({ items: unsortedList });

response.data.sorted; // [2, 5, 7, 8, 9, 21, 64]
```

Shows:

- a tool using a custom schema including arrays in both the input and output

See:

- [Sort Items Tool](./tools/sort-list/sort-items-tool.ts)
- [Definition](./tools/sort-list/sort-items-fn.ts)
- [Usage](./tools/sort-list/index.ts)
