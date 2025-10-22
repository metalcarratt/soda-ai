import z from "zod";
import { soda } from "soda-ai";
import { localModel } from "../../models/localModel";

const SafetyEnum = z.enum(['dangerous', 'warning', 'safe']);

const schema = {
    action: `review the following email and check if it contains anything that could compromise the company's values. We don't want any of the following:
- rude language, definitely no swearing
- speaking anything bad about the CEO or other managers in the company
- revealing any trade secrets

While revealing personal information (such as passwords) does not compromise the company, it could be unsafe for the sender and we would like to flag it as a warning.
`,
    inputs: z.object({
        email: z.string().describe('contents of an email being sent')
    }),
    outputs: z.object({
        safety: SafetyEnum
            .describe(`'safe' means we can send the email to the recipient without
                further action. 'warning' means we can send it but we need to flag it to be reviewed by one of our staff. 'dangerous' means we
                absolutely should not send it`),
        reason: z.string().describe('your reasoning for the safety labelling, including why you think the other labels don\'t match.')
    })
}

const examples = [{
    given: {
        email: 'Hi, how are you?'
    },
    expect: {
        safety: 'safe' as z.infer<typeof SafetyEnum>,
        reason: 'there is nothing harmful about this email'
    }
}]

export const checkEmailFn = soda(localModel, schema, examples);