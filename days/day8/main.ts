import { combinations } from "@elf/combinatorics/Combinations";

type Point = { r: number; c: number };

const parseInput = (filename: string): string[][] => {
  return Deno.readTextFileSync(filename)
    .split("\n")
    .map((line) => line.split(""));
};

const generateNodeObj = (grid: string[][]) =>
  grid.reduce(
    (nodeMap, row, r) =>
      row
        .reduce((nodeMap, value, c) => {
          if(value === '.') return nodeMap;

          if (!nodeMap[value]) nodeMap[value] = [];
          nodeMap[value].push({ r, c });
          return nodeMap;
        }, nodeMap),
    {} as Record<string, Point[]>
  );

const isInGrid = ({ r, c }: Point, rows: number, cols: number) =>
  r >= 0 && r < rows && c >= 0 && c < cols;

const part1 = (filename: string) => {
  const input = parseInput(filename);
  const [rows, cols] = [input.length, input[0].length];

  const nodeMap = generateNodeObj(input);

  return (
    Object.values(nodeMap)
      // Find all possible antinodes for each node
      .flatMap((points) =>
        combinations(points, 2).flatMap(
          ([{ r: r1, c: c1 }, { r: r2, c: c2 }]) => {
            const [dr, dc] = [r2 - r1, c2 - c1];
            return [
              { r: r1 - dr, c: c1 - dc },
              { r: r2 + dr, c: c2 + dc },
            ];
          }
        )
      )
      // Filter out points outside of the grid
      .filter((point) => isInGrid(point, rows, cols))
      // Filter out unique by stringifying and filtering
      .map(({ r, c }) => `${r},${c}`)
      .filter((point, index, arr) => arr.indexOf(point) === index).length
  );
};

const part2 = (filename: string) => {
  const input = parseInput(filename);
  const [rows, cols] = [input.length, input[0].length];

  const nodeMap = generateNodeObj(input);

  return Object.values(nodeMap)
    // For each set of nodes, calculate all antinodes within the grid
    .flatMap((points) =>
      combinations(points, 2).flatMap(
        ([{ r: r1, c: c1 }, { r: r2, c: c2 }]) => {
          const [dr, dc] = [r2 - r1, c2 - c1];
          const result = [];

          // Project from p1 to the edge of the grid
          let projection = { r: r1, c: c1 };
          while (isInGrid(projection, rows, cols)) {
            result.push(`${projection.r},${projection.c}`);
            projection = { r: projection.r - dr, c: projection.c - dc };
          }

          // Project from p2 to the other edge of the grid
          projection = { r: r2, c: c2 };
          while (isInGrid(projection, rows, cols)) {
            result.push(`${projection.r},${projection.c}`);
            projection = { r: projection.r + dr, c: projection.c + dc };
          }

          return result;
        }
      )
    )
    // Filter out only unique points
    .filter((point, index, arr) => arr.indexOf(point) === index).length;
};

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
