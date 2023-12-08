const decoder = new TextDecoder();

const zero = "0".charCodeAt(0);
const nine = "9".charCodeAt(0);

let sum = 0;

for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk);
  if (line === "\n") {
    console.log(`sum: ${sum}`);
    break;
  }
  const charCodes = line.split("").map((c) => c.charCodeAt(0));
  const isDigit = (charCode: number) => charCode >= zero && charCode <= nine;
  const firstDigit = charCodes.find(isDigit)! - zero;
  const lastDigit = charCodes.findLast(isDigit)! - zero;
  sum += firstDigit * 10 + lastDigit;
}
