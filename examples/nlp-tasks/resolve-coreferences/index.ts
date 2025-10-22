import { paragraph1 } from "../common/abraham-lincoln-text";
import { resolveCoreferences } from "./resolve-coreferences";

const { entity, mentions } = await resolveCoreferences({ text: paragraph1, entity: 'Abraham Lincoln' }, { debug: true });
console.log('Entity: ', entity);
console.log('Mentions: ', mentions);



// let highlighted = paragraph1;
// const { start, end } = mentions[0];
// highlighted = `${highlighted.slice(0, start)}**${highlighted.slice(start, end)}**${highlighted.slice(end)}`;

// console.log('highlighted', highlighted);