import { describe, expect, test } from "vitest";
import { checkEmailFn } from "./check-email-fn.js";
import { expectValidSummary } from "../../testing/summarisation-test/validate-summary.js";

describe('check the email', () => {
    test('a safe email', async () => {
        const email = "Hi Bob, I've got the stuff. Sending it through now.";
        const response = await checkEmailFn({ email });
        // console.log(response);

        expect(response.data.safety).toBe('safe');
    });

    test('an email containing a password', async () => {
        const email = "Just drop the stuff inside the door. The passcode to my house is 12345.";
        const response = await checkEmailFn({ email });
        // console.log(response);

        expect(response.data.safety).toBe('warning');
        expectValidSummary('personal information', response.data.reason);
    });

    test('an agressive email', async () => {
        const email = "You guys are quite dumb, aren't you? I\'ve explained how to fix the problem so many times now and you still don't get it!";
        const response = await checkEmailFn({ email });
        // console.log(response);

        expect(response.data.safety).toBe('dangerous');
        expectValidSummary('rude language', response.data.reason);
    });

    test('an email bad mouthing the ceo', async () => {
        const email = "I'm so annoyed at our CEO. He's doing all the wrong things and never listens to a word we say.";
        const response = await checkEmailFn({ email });
        // console.log(response);

        expect(response.data.safety).toBe('dangerous');
        expectValidSummary('speak bad about ceo', response.data.reason);
    });

    test('an email selling company secrets', async () => {
        const email = "I got the money you sent and I can tell you that I have proof our company is about to go under. What me to set up a deal?";
        const response = await checkEmailFn({ email });
        // console.log(response);

        expect(response.data.safety).toBe('dangerous'); // I can't seem to get it to interpret this as a dangerous
        expectValidSummary('secrets', response.data.reason);
    });
}, 10000);

