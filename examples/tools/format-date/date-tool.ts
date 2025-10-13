import { createTool } from "soda-ai";

export const dateTool = createTool({
    name: 'getDate',
    instruct: 'returns today\'s date',
    call: () => `${new Date()}`
});