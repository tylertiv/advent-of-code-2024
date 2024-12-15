/*
    Solution
*/

import { zip } from "@std/collections/zip";
import { getInputLines } from "../../lib/getInputLines.ts";
import { isInGrid } from "../../lib/isInGrid.ts";

const directions = [
  { dr: -1, dc: 0 }, // up
  { dr: 1, dc: 0 }, // down
  { dr: 0, dc: -1 }, // left
  { dr: 0, dc: 1 }, // right
];

const cornerDirections = [
  { dir: "up", dr: -1, dc: 0 }, // up
  { dir: "down", dr: 1, dc: 0 }, // down
  { dir: "left", dr: 0, dc: -1 }, // left
  { dir: "right", dr: 0, dc: 1 }, // right
  { dir: "upleft", dr: -1, dc: -1 }, // up left
  { dir: "upright", dr: -1, dc: 1 }, // up right
  { dir: "downleft", dr: 1, dc: -1 }, // down left
  { dir: "downright", dr: 1, dc: 1 }, // down right
];

const visitedKey = ({ r, c }: { r: number; c: number }) => `${r},${c}`;

const calcMeasurements = (
  { r, c }: { r: number; c: number },
  garden: string[],
  rows: number,
  cols: number,
  visited: Set<string>
) => {
  const isInGridAndSameSymbol = (
    { r, c }: { r: number; c: number },
    symbol: string
  ) => isInGrid([r, c], rows, cols) && symbol === garden[r][c];

  const plotSymbol = garden[r][c];
  const queue = [{ r, c }];
  const plot = [];

  let perimeter = 0;

  while (queue.length > 0) {
    const { r, c } = queue.shift()!;
    if (!isInGrid([r, c], rows, cols) || garden[r][c] !== plotSymbol) {
      perimeter++;
      continue;
    }
    if (!visited.has(visitedKey({ r, c }))) {
      visited.add(visitedKey({ r, c }));
      plot.push({ r, c });
      for (const { dr, dc } of directions) {
        queue.push({ r: r + dr, c: c + dc });
      }
    }
  }

  const corners = plot.map(({ r, c }) => {
    // @ts-ignore works but too lazy for types
    const { up, down, left, right, upleft, upright, downleft, downright } =
      cornerDirections.reduce(
        (acc, { dir, dr, dc }) => ({
          ...acc,
          [dir]: isInGridAndSameSymbol(
            {
              r: r + dr,
              c: c + dc,
            },
            garden[r][c]
          ),
        }),
        {}
      );

    return Object.entries({
      concaveUpLeft: up && left && !upleft,
      concaveUpRight: up && right && !upright,
      concaveDownLeft: down && left && !downleft,
      concaveDownRight: down && right && !downright,
      convexUpLeft: !(up || left),
      convexUpRight: !(up || right),
      convexDownLeft: !(down || left),
      convexDownRight: !(down || right),
    })
      .filter(([_, val]) => val)
      .map(([name]) => name);
  });

  // console.log(zip(plot, corners)) 

  return {
    perimeter,
    area: plot.length,
    numberOfSides: corners.reduce((sum, cornersAtPoint) => sum + cornersAtPoint.length, 0),
  };
};

const part1 = (filename: string) => {
  const garden = getInputLines(filename);
  const { rows, cols } = { rows: garden.length, cols: garden[0].length };

  const visited = new Set<string>();

  const points = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ r, c }))
  ).flat();

  return points
    .map(({ r, c }) => {
      if (!visited.has(visitedKey({ r, c }))) {
        const { perimeter, area } = calcMeasurements(
          { r, c },
          garden,
          rows,
          cols,
          visited
        );
        return { perimeter, area };
      }
    })
    .filter((measurement) => !!measurement)
    .reduce((sum, { perimeter, area }) => sum + perimeter * area, 0);
};

const part2 = (filename: string) => {
  const garden = getInputLines(filename);
  const { rows, cols } = { rows: garden.length, cols: garden[0].length };

  const visited = new Set<string>();

  const points = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ r, c }))
  ).flat();

  return points
    .map(({ r, c }) => {
      if (!visited.has(visitedKey({ r, c }))) {
        const { numberOfSides, area } = calcMeasurements(
          { r, c },
          garden,
          rows,
          cols,
          visited
        );
        return { numberOfSides, area };
      }
    })
    .filter((measurement) => !!measurement)
    .reduce((sum, { numberOfSides, area }) => sum + numberOfSides * area, 0);
};

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
