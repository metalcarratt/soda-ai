# Examples

## Translate language

Translate a text from one language to another

```ts
const response = await translateFn({
  text: "Good morning",
  language: "Chinese",
});

response.translation; // 早上好
```

To run:

- `sh scripts/translate-language.sh`

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

response.answer; // 3.1
```

To run:

- `sh scripts/answer-with-number.sh`

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

response.safety === "safe"; // true
```

To run:

- `sh scripts/email-checker.sh`

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

response.date; // 08/10/2025
```

To run:

- `sh scripts/format-date.sh`

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

response.sorted; // [2, 5, 7, 8, 9, 21, 64]
```

To run:

- `sh scripts/sort-list.sh`

Shows:

- a tool using a custom schema including arrays in both the input and output

See:

- [Sort Items Tool](./tools/sort-list/sort-items-tool.ts)
- [Definition](./tools/sort-list/sort-items-fn.ts)
- [Usage](./tools/sort-list/index.ts)

## Label entities

Labels all entities in a provided text.

```ts
const { entities } = await labelEntities({ text }, { debug: true });
console.log("Entities: ", entities);

// [
//  { entity: 'Abraham Lincoln', type: 'Person' },
//  { entity: 'Mary Todd Lincoln', type: 'Person' },
//  { entity: 'Henry R. Rathbone', type: 'Person' }
// ]
```

To run:

- `sh scripts/label-entities.sh`

Shows:

- Chunking

See:

- [Definition](./nlp-tasks/label-entities/label-entities.ts)
- [Usage](./nlp-tasks/label-entities/index.ts)

## Resolve coreferences

Finds all occurences of an entity in a text (including third person references, etc.)

```ts
const { mentions } = await resolveCoreferences(
  { text: paragraph1, entity: "Abraham Lincoln" },
  { debug: true }
);
// mentions = [
//   { text: 'President Abraham Lincoln', start: 0, end: 23 },
//   { text: 'him', start: 24, end: 26 }
// ]
```

To run:

- `sh scripts/resolve-coreferences.sh`

See:

- [Definition](./nlp-tasks/resolve-coreferences/resolve-coreferences.ts)
- [Usage](./nlp-tasks/resolve-coreferences/index.ts)
