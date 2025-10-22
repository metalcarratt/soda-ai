import { describe, expect, test } from "vitest";
import { text } from "../common/abraham-lincoln-text";
import { labelEntities } from "./label-entities";

describe('label entities', () => {
    test('label in entities in long text', async () => {
        const { entities } = await labelEntities({ text });
        // console.log('Entities: ', entities);

        const abrahamEntity = entities.find(entity => entity.entity === 'Abraham Lincoln');
        expect(abrahamEntity?.type).toStrictEqual('Person');

        const boothEntity = entities.find(entity => entity.entity === 'John Wilkes Booth');
        expect(boothEntity?.type).toStrictEqual('Person');
    })
}, 40000);