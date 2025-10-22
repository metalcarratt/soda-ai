import { translateFn } from "./translate-fn";

const { translation } = await translateFn({
    text: 'Good morning',
    language: 'Chinese'
}, { debug: true });

console.log('Translation:', translation);