const getNumbers = (numbersSegment: string) =>
  numbersSegment.trim().split(/\s+/g).map((n) => Number.parseInt(n, 10));

const decoder = new TextDecoder();

let sum = 0;

const cardCopies = new Map();

for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk);
  if (line.length <= 1) {
    break;
  }
  const [cardSegment, numbersSegment] = line.split(":");
  const [_, cardNumberSegment] = cardSegment.split(/\s+/g);
  const cardNumber = Number.parseInt(cardNumberSegment, 10);
  const numCopies = cardCopies.get(cardNumber) ?? 0;
  sum += numCopies;
  const [winningNumbersSegment, revealedNumbersSegment] = numbersSegment.split(
    "|",
  );
  const winningNumbers = getNumbers(winningNumbersSegment);
  const revealedNumbers = getNumbers(revealedNumbersSegment);
  const winningCount = revealedNumbers.reduce(
    (cardValue, rn) => winningNumbers.includes(rn) ? cardValue + 1 : cardValue,
    0,
  );
  sum++;
  const totalInstances = winningCount > 0 ? numCopies + 1 : numCopies;
  for (let cn = cardNumber + 1; cn <= cardNumber + winningCount; cn++) {
    const cnCopies = cardCopies.get(cn) ?? 0;
    cardCopies.set(cn, cnCopies + totalInstances);
  }
}

console.log(`sum: ${sum}`);
