const getNumbers = (numbersSegment: string) =>
  numbersSegment.trim().split(/\s+/g).map((n) => Number.parseInt(n, 10));

const decoder = new TextDecoder();

let sum = 0;

for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk);
  if (line.length <= 1) {
    break;
  }
  const [_, numbersSegment] = line.split(":");
  const [winningNumbersSegment, revealedNumbersSegment] = numbersSegment.split(
    "|",
  );
  const winningNumbers = getNumbers(winningNumbersSegment);
  const revealedNumbers = getNumbers(revealedNumbersSegment);
  sum += revealedNumbers.reduce(
    (cardValue, rn) =>
      winningNumbers.includes(rn)
        ? cardValue === 0 ? 1 : cardValue * 2
        : cardValue,
    0,
  );
}

console.log(`sum: ${sum}`);
