import { sumOf, zip } from "@std/collections";
import { getInputLines } from "../../lib/getInputLines.ts";

function parseInput(inputFile: string) {
  const pairs = getInputLines(inputFile)
    .map((line) => /(\d+)\W+(\d+)/.exec(line))
    .map((match) => [match![1], match![2]].map((num) => parseInt(num)));

  return {
    firstList: pairs.map((pair) => pair[0]),
    secondList: pairs.map((pair) => pair[1]),
  };
}

function part1(inputFile: string) {
  const { firstList, secondList } = parseInput(inputFile);

  const sortedFirstList = firstList.sort();
  const sortedSecondList = secondList.sort();

  return sumOf(zip(sortedFirstList, sortedSecondList), ([first, second]) =>
    Math.abs(first - second)
  );
}

function part2(inputFile: string) {
  const { firstList, secondList } = parseInput(inputFile);

  const secondListFrequencies = secondList.reduce(
    (acc: Record<number, number>, second) => ({
      ...acc,
      [second]: acc[second] ? acc[second] + 1 : 1,
    }),
    {}
  );

  return firstList.reduce(
    (acc, first) => acc + first * (secondListFrequencies[first] ?? 0),
    0
  );
}

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
