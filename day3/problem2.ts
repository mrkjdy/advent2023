const isDigit = (char: unknown) =>
  typeof char === "string" && char >= "0" && char <= "9";

const findStart = (line: string, digitIndex: number) =>
  line.slice(0, digitIndex).split("").reduceRight(
    (start) => isDigit(line.at(start - 1)) ? start - 1 : start,
    digitIndex,
  );

const numberStartingAt = (line: string, start: number) => {
  const end = line.slice(start).split("").reduce(
    (end) => isDigit(line.at(end + 1)) ? end + 1 : end,
    start,
  ) + start;
  return Number.parseInt(line.slice(start, end + 1), 10);
};

const numbersInRange = (line: string, gearIndex: number) => {
  const left = Math.max(0, gearIndex - 1);
  const right = gearIndex + 1;
  const starts = new Set<number>();
  if (isDigit(line.at(left))) {
    starts.add(findStart(line, left));
  }
  if (isDigit(line.at(gearIndex))) {
    starts.add(findStart(line, gearIndex));
  }
  if (isDigit(line.at(right))) {
    starts.add(findStart(line, right));
  }
  return [...starts.values()].map((start) => numberStartingAt(line, start));
};

const findNumbersAround = (
  previousLine: string,
  currentLine: string,
  nextLine: string,
  gearIndex: number,
) => {
  const previousLineNumbers = numbersInRange(previousLine, gearIndex);
  const currentLineNumbers = numbersInRange(currentLine, gearIndex);
  const nextLineNumbers = numbersInRange(nextLine, gearIndex);
  return [
    ...previousLineNumbers,
    ...currentLineNumbers,
    ...nextLineNumbers,
  ];
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
  for (const [charIndex, char] of currentLine.split("").entries()) {
    if (char === "*") {
      const previousLine = lines.at(lineIndex - 1) ?? "";
      const nextLine = lines.at(lineIndex + 1) ?? "";
      const numbers = findNumbersAround(
        previousLine,
        currentLine,
        nextLine,
        charIndex,
      );
      if (numbers.length === 2) {
        sum += numbers[0] * numbers[1];
      }
    }
  }
}

console.log(`sum: ${sum}`);
