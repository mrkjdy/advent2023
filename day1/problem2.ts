const decoder = new TextDecoder();

const zero = "0".charCodeAt(0);
const nine = "9".charCodeAt(0);

const spelledDigits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

let sum = 0;

for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk);
  if (line === "\n") {
    console.log(`sum: ${sum}`);
    break;
  }
  const lineChars = line.split("");
  const isDigit = (charCode: number) => charCode >= zero && charCode <= nine;
  const firstDigit = lineChars.reduce((firstDigit, char, index) => {
    if (firstDigit > 0) {
      return firstDigit;
    }
    const charCode = char.charCodeAt(0);
    if (isDigit(charCode)) {
      return charCode - zero;
    }
    const substring = lineChars.slice(index, lineChars.length).join("");
    return spelledDigits.findIndex((spelledDigit) =>
      substring.startsWith(spelledDigit)
    ) + 1;
  }, 0);
  const lastDigit = lineChars.reduceRight((lastDigit, char, index) => {
    if (lastDigit > 0) {
      return lastDigit;
    }
    const charCode = char.charCodeAt(0);
    if (isDigit(charCode)) {
      return charCode - zero;
    }
    const substring = lineChars.slice(0, index + 1).join("");
    return spelledDigits.findIndex((spelledDigit) =>
      substring.endsWith(spelledDigit)
    ) + 1;
  }, 0);
  sum += firstDigit * 10 + lastDigit;
}
