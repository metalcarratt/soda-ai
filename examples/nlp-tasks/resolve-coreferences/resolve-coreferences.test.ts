import { describe, expect, test } from "vitest";
import { paragraph1 } from "../common/abraham-lincoln-text";
import { resolveCoreferences } from "./resolve-coreferences";

describe('label entities', () => {
    test('label in entities in long text', async () => {
        const { mentions } = await resolveCoreferences({ text: paragraph1, entity: 'Abraham Lincoln' }, { debug: true });

        expect(mentions.some(mention => mention.text === 'President Abraham Lincoln')).toBeTruthy();
        expect(mentions.some(mention => mention.text === 'him')).toBeTruthy();
    });
}, 10000);