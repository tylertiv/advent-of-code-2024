import { slidingWindows } from "@std/collections/sliding-windows";
import { getInputLines } from "../../lib/getInputLines.ts";

const parseInput = (filename: string) =>
  getInputLines(filename).map((line) =>
    line.split(" ").map((num) => parseInt(num.trim()))
  );

const omit = (arr: number[], index: number) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

const isStrictlyIncreasing = (arr: number[]) =>
  slidingWindows(arr, 2).every(([first, second]) => first < second);

const isStrictlyIncreasingOrDecreasing = (arr: number[]) =>
  isStrictlyIncreasing(arr) || isStrictlyIncreasing(arr.slice().reverse());

const isGraduallyIncreasingOrDecreasing = (arr: number[]) =>
  slidingWindows(arr, 2).every(
    ([first, second]) => Math.abs(first - second) <= 3
  );

const isValidReport = (numbers: number[]) =>
  isStrictlyIncreasingOrDecreasing(numbers) &&
  isGraduallyIncreasingOrDecreasing(numbers);

const part1 = (filename: string) =>
  parseInput(filename).map(isValidReport).filter(Boolean).length;

const part2 = (filename: string) =>
  parseInput(filename)
    .map((numbers) => {
      if (isValidReport(numbers)) return true;

      const omittedPermutations = numbers.map((_, index, arr) =>
        omit(arr, index)
      );
      return omittedPermutations.map(isValidReport).some(Boolean);
    })
    .filter(Boolean).length;

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
