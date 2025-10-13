import { soda } from "soda-ai";
import { localModel } from "../../models/localModel";
import z from "zod";

const schema = {
    action: 'translate the text into the given language',
    inputs: z.object({
        text: z.string(),
        language: z.string()
    }),
    outputs: z.object({
        translation: z.string()
    })
}

const examples = [{
    given: {
        text: 'Let\'s get something to eat',
        language: 'Korean'
    },
    expect: {
        translation: '뭐 좀 먹자'
    }
}, {
    given: {
        text: 'What\'s your name?',
        language: 'Chinese'
    },
    expect: {
        translation: '你叫什么名字'
    }
}]

export const translateFn = soda(localModel, schema, examples);