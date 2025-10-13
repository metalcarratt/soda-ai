import { formatTodaysDate } from "./format-todays-date";

// const response = await formatTodaysDate({ format: 'DD/MM/YYYY' }, { debug: true });
// console.log('Today\'s Date in DD/MM/YYYY:', response.data.date);

const response2 = await formatTodaysDate({ format: 'YYYY-MM-DD' });
console.log('Today\'s Date in [YYYY-MM-DD]:', response2.data.date);