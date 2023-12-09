const isDigit = (char: unknown) =>
  typeof char === "string" && char >= "0" && char <= "9";

const isSymbol = (char: unknown) =>
  typeof char === "string" && char !== "." && !isDigit(char);

const hasSymbolAround = (
  previousLine: string,
  currentLine: string,
  nextLine: string,
  start: number,
  end: number,
) => {
  const left = Math.max(0, start - 1);
  const right = end + 1;
  return previousLine.split("").slice(left, right + 1).some(isSymbol) ||
    isSymbol(currentLine.at(left)) ||
    isSymbol(currentLine.at(right)) ||
    nextLine.slice(left, right + 1).split("").some(isSymbol);
};

const lines = [];

const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk).replace("\n", "");
  if (line.length <= 0) {
    break;
  }
  lines.push(line);
}

let sum = 0;

for (const [lineIndex, currentLine] of lines.entries()) {
  let start;
  let end;
  for (const [charIndex, char] of currentLine.split("").entries()) {
    if (isDigit(char)) {
      start ??= charIndex;
      end = charIndex;
    }
    if (isDigit(currentLine.at(charIndex + 1))) {
      continue;
    }
    if (typeof start === "number" && typeof end === "number") {
      const number = Number.parseInt(currentLine.slice(start, end + 1), 10);
      const previousLine = lines.at(lineIndex - 1) ?? "";
      const nextLine = lines.at(lineIndex + 1) ?? "";
      sum += hasSymbolAround(previousLine, currentLine, nextLine, start, end)
        ? number
        : 0;
      start = undefined;
      end = undefined;
    }
  }
}

console.log(`sum: ${sum}`);
