import { getInputLines } from "../../lib/getInputLines.ts";
import { isInGrid } from "../../lib/isInGrid.ts";

type Point = { r: number; c: number };

const directions = [
  { dr: -1, dc: 0 }, // UP
  { dr: 1, dc: 0 }, // DOWN
  { dr: 0, dc: 1 }, // RIGHT
  { dr: 0, dc: -1 }, // LEFT
];

/**
 * Find potential trail starting points in a topographical map
 *
 * @param grid - A 2D grid of numbers representing a topographical map
 * @returns An array of potential trailhead coordinates, where the height is 0
 */
const findTrailHeads = (grid: number[][]) =>
  grid.flatMap((row, r) =>
    row
      .map((value, c) => (value === 0 ? { r, c } : null))
      .filter((value) => !!value)
  );

/**
 * Use DFS to count all possible peaks that can be reached from a given starting point
 *
 * @param point - The starting point to count trails from
 * @param grid - 2D array of numbers representing the topographical map
 * @param options - Optional configuration for trail counting
 * @param options.uniquePaths - Flag to determine if unique trails to reach a peak, should be counted, as opposed to just possible peaks (default: false)
 * @returns {number} The number of unique or total trail ends
 */
const countReachablePeaksFrom = (
  point: Point,
  grid: number[][],
  { uniquePaths } = { uniquePaths: false }
) => {
  const stack = [point];
  const trailEnds = [];

  while (stack.length > 0) {
    const { r, c } = stack.pop()!;

    if (grid[r][c] === 9) {
      trailEnds.push([r, c].join());
    }

    for (const { dr, dc } of directions) {
      if (
        isInGrid([r + dr, c + dc], grid.length, grid[0].length) &&
        grid[r + dr][c + dc] === 1 + grid[r][c]
      )
        stack.push({ r: r + dr, c: c + dc });
    }
  }

  return uniquePaths ? trailEnds.length : new Set(trailEnds).size;
};

const parseInput = (filename: string) =>
  getInputLines(filename).map((row) => row.split("").map((s) => parseInt(s)));

const part1 = (grid: number[][]) =>
  findTrailHeads(grid)
    .map((startingPoint) => countReachablePeaksFrom(startingPoint, grid))
    .reduce((sum, trailValue) => sum + trailValue);

const part2 = (grid: number[][]) =>
  findTrailHeads(grid)
    .map((trailHead) =>
      countReachablePeaksFrom(trailHead, grid, { uniquePaths: true })
    )
    .reduce((sum, trailHeadScore) => sum + trailHeadScore);

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  const testGrid = parseInput(`${inputPath}/test.txt`);
  const fullGrid = parseInput(`${inputPath}/full.txt`);

  console.log(`part1 testInput: ${part1(testGrid)}`);
  console.log(`part1 input: ${part1(fullGrid)}`);

  // // Part 2
  console.log(`part2 testInput: ${part2(testGrid)}`);
  console.log(`part2 input: ${part2(fullGrid)}`);
}
