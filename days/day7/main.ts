import { zip } from "@std/collections";
import { getInputLines } from "../../lib/getInputLines.ts";

const parseEquation = (
  operators: Record<string, CallableFunction>,
  permutationNum: number,
  numbers: number[]
) => {
  // Generate operators from binary representation of permuatation number
  const operatorArr = permutationNum
    .toString(Object.keys(operators).length)
    .padStart(numbers.length - 1, "0")
    .split("")
    .map((i) => parseInt(i))
    .map((i) => Object.keys(operators)[i]);

  const equation = [numbers[0], ...zip(operatorArr, numbers.slice(1))].flat();

  let result = equation[0];
  let currentOp = "";
  for (const e of equation.slice(1)) {
    // If at an operator, set that as the current operator
    if (Object.keys(operators).includes(e.toString())) {
      currentOp = e.toString();
      continue;
    }
    const a = result;
    result = operators[currentOp](a as number, e as number);
  }
  return result;
};

const parseInput = (filename: string) =>
  getInputLines(filename)
    .map((line) => line.split(":").map((half) => half.trim()))
    .map(([target, numbers]) => ({
      testNumber: parseInt(target),
      numbers: numbers.split(" ").map((n) => parseInt(n)),
    }));

const part1Operators = {
  "*": (a: number, b: number) => a * b,
  "+": (a: number, b: number) => a + b,
};

const part1 = (filename: string) =>
  parseInput(filename)
    .filter(({ testNumber, numbers }) => {
      const operatorPermutations = Math.pow(2, numbers.length - 1);
      for (let i = 0; i < operatorPermutations; i++) {
        return parseEquation(part1Operators, i, numbers) === testNumber;
      }
    })
    .reduce((sum, { testNumber }) => sum + testNumber, 0);

const part2Operators = {
  ...part1Operators,
  "||": (a: number, b: number) => parseInt(`${a}${b}`),
};

const part2 = (filename: string) =>
  parseInput(filename)
    .filter(({ testNumber, numbers }) => {
      const operatorPermutations = Math.pow(3, numbers.length - 1);
      for (let i = 0; i < operatorPermutations; i++) {
        if (parseEquation(part2Operators, i, numbers) === testNumber) {
          return true;
        }
      }
      return false;
    })
    .reduce((sum, { testNumber }) => sum + testNumber, 0);

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
