const decoder = new TextDecoder();

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
  const rounds = line.slice(semiIndex + 1).split(";").map(parseRound);
  const minimum = rounds.reduce((currentMin, round) => {
    currentMin.red = Math.max(currentMin.red, round.red);
    currentMin.green = Math.max(currentMin.green, round.green);
    currentMin.blue = Math.max(currentMin.blue, round.blue);
    return currentMin;
  }, {
    red: 0,
    green: 0,
    blue: 0,
  });
  sum += minimum.red * minimum.green * minimum.blue;
}
