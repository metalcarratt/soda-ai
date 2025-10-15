import { describe, expect, test } from "vitest";
import { text } from "../common/abraham-lincoln-text";
import { labelEntities } from "./label-entities";

describe('label entities', () => {
    test('label in entities in long text', async () => {
        const response = await labelEntities({ text });
        // console.log('Entities: ', response.data.entities);

        const abrahamEntity = response.data.entities.find(entity => entity.entity === 'Abraham Lincoln');
        expect(abrahamEntity?.type).toStrictEqual('Person');
    })
}, 20000);