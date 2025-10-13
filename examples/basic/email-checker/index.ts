import { checkEmailFn } from "./check-email-fn";

const email = "Hi Bob, I've got the stuff. Sending it through now.";
const response = await checkEmailFn({ email });

console.log('Safe?', response.data.safety === 'safe');
console.log('Safety:', response.data.safety);
console.log('Reason:', response.data.reason);
