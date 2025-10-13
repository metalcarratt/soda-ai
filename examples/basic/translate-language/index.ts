import { translateFn } from "./translate-fn";

const response = await translateFn({
    text: 'Good morning',
    language: 'Chinese'
});
console.log('Translation:', response.data.translation);