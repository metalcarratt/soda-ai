import { checkEmailFn } from "./check-email-fn";

const email = "Hi Bob, I've got the stuff. Sending it through now.";
const { safety, reason } = await checkEmailFn({ email }, { debug: true });

console.log('Safe?', safety === 'safe');
console.log('Safety:', safety);
console.log('Reason:', reason);
