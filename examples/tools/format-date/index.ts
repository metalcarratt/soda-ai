import { formatTodaysDate } from "./format-todays-date";

// const { date } = await formatTodaysDate({ format: 'DD/MM/YYYY' }, { debug: true });
// console.log('Today\'s Date in DD/MM/YYYY:', date);

const { date } = await formatTodaysDate({ format: 'YYYY-MM-DD' }, { debug: true });
console.log('Today\'s Date in [YYYY-MM-DD]:', date);