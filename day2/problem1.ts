const decoder = new TextDecoder();

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

enum Color {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

const colors = Object.values(Color);

const isColor = (c: unknown): c is Color =>
  typeof c === "string" && colors.includes(c as Color);

const parseRound = (round: string) =>
  round.split(",").reduce((totals, draw) => {
    const [amount, color] = draw.trim().split(" ");
    if (isColor(color)) {
      totals[color] = Number.parseInt(amount, 10);
    }
    return totals;
  }, { red: 0, green: 0, blue: 0 });

let sum = 0;

for await (const chunk of Deno.stdin.readable) {
  const line = decoder.decode(chunk);
  if (line === "\n") {
    console.log(`sum: ${sum}`);
    break;
  }
  const semiIndex = line.indexOf(":");
  const gameNumber = Number.parseInt(line.slice("Game ".length, semiIndex), 10);
  const rounds = line.slice(semiIndex + 1).split(";").map(parseRound);
  if (
    rounds.every((round) =>
      round.red <= max.red && round.green <= max.green && round.blue <= max.blue
    )
  ) {
    sum += gameNumber;
  }
}
