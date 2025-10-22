import { text } from "../common/abraham-lincoln-text";
import { labelEntities } from "./label-entities";

const { entities } = await labelEntities({ text }, { debug: true });
console.log('Entities: ', entities);
