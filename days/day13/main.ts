/*
    Solution
*/
import { Matrix, invert, multiply } from "@maths/matrix";

const extractDirections = (direction: string) => {
  const inputRegex = /X[+=](?<x>\d+).*Y[+=](?<y>\d+)/;
  const match = direction.match(inputRegex);

  if (!match?.groups) throw new Error("Regex not properly matched");

  return { x: parseInt(match.groups["x"]), y: parseInt(match.groups["y"]) };
};

const parseInput = (filename: string) =>
  Deno.readTextFileSync(filename)
    .split("\n\n")
    .map((section) => section.split("\n"))
    .map(([buttonA, buttonB, prize]) => ({
      a: extractDirections(buttonA),
      b: extractDirections(buttonB),
      prize: extractDirections(prize),
      //   Object.fromEntries(
      //     Object.entries(extractDirections(prize)).map(([key, value]) => [
      //       key,
      //     //   value + 10000000000000,
      //     ])
      //   ),
    }));

const part1 = (filename: string) =>
  parseInput(filename)
    .map(({ a, b, prize }, i) => {
      const coefficientsMat = new Matrix([a.x, b.x, a.y, b.y], 2, 2);
      const prizeMat = new Matrix([prize.x, prize.y], 2, 1);
      const resultMatrix = multiply(invert(coefficientsMat), prizeMat);

      if (
        resultMatrix.data.every(
          (val) =>
            Math.floor(parseFloat(val.toPrecision(10))) ===
            parseFloat(val.toPrecision(10))
        )
      ) {
        return {
          aIterations: resultMatrix.data[0],
          bIterations: resultMatrix.data[1],
        };
      }
    })
    .filter((x) => !!x)
    .map((x) => (console.log(x), x))
    .reduce(
      (sum, { aIterations, bIterations }) =>
        sum + 3 * aIterations + bIterations,
      0
    );

function part2(filename: string) {}

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  //   console.log(`parst1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  //   console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  //   console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
