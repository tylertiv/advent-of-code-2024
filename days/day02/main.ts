import { slidingWindows } from "@std/collections/sliding-windows";
import { getInputLines } from "../../lib/getInputLines.ts";

const parseInput = (filename: string) =>
  getInputLines(filename).map((row) =>
    row.split(" ").map((num) => parseInt(num.trim()))
  );

const omit = (arr: number[], index: number) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

const isStrictlyIncreasing = (arr: number[]) =>
  slidingWindows(arr, 2).every(([first, second]) => first < second);

const isStrictlyIncreasingOrDecreasing = (arr: number[]) =>
  isStrictlyIncreasing(arr) || isStrictlyIncreasing([...arr].reverse());

const isGraduallyChanging = (arr: number[]) =>
  slidingWindows(arr, 2).every(
    ([first, second]) => Math.abs(first - second) <= 3
  );

const isValidReport = (row: number[]) =>
  isStrictlyIncreasingOrDecreasing(row) && isGraduallyChanging(row);

const part1 = (filename: string) =>
  parseInput(filename).filter(isValidReport).length;

const part2 = (filename: string) =>
  parseInput(filename).filter(
    (row) =>
      isValidReport(row) ||
      row.some((_, index) => isValidReport(omit(row, index)))   // Check if omitting one element anywhere in the row can make it valid
  ).length;

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
