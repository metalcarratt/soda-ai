import { sortList } from "./sort-items-fn";

const unsortedList = [9, 5, 7, 21, 64, 8, 2];

const response = await sortList({ items: unsortedList });
console.log('Sorted list:', response.data.sorted);
