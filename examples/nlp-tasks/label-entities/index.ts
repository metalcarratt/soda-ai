import { text } from "../common/abraham-lincoln-text";
import { labelEntities } from "./label-entities";

const response = await labelEntities({ text }, { debug: true });
console.log('Entities: ', response.data.entities);
