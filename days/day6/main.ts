enum Positions {
  Guard = "^",
  Obstacle = "#",
  Checked = "X",
  Empty = ".",
}

type Direction = { dr: number; dc: number; name: string };
const Directions = Object.freeze({
  Up: { dr: -1, dc: 0, name: "Up" } as Direction,
  Down: { dr: 1, dc: 0, name: "Down" } as Direction,
  Left: { dr: 0, dc: -1, name: "Left" } as Direction,
  Right: { dr: 0, dc: 1, name: "Right" } as Direction,
});
type DirectionName = keyof typeof Directions;

const rotate = (d: DirectionName): Direction => {
  switch (d) {
    case "Up":
      return Directions.Right;
    case "Right":
      return Directions.Down;
    case "Down":
      return Directions.Left;
    case "Left":
      return Directions.Up;
  }
};

const printMap = (
  map: Positions[][],
  direction: Direction,
  disabled = false
) => {
  if (disabled) return;
  map.forEach((row) => console.log(row.join(" ")));
  console.log(`Current Direction: ${direction.name}`);
  console.log("--------");
};

const parseInput = (filename: string): Positions[][] => {
  return Deno.readTextFileSync(filename)
    .split("\n")
    .map((line) => line.split("") as Positions[]);
};

const isInMap = ([r, c]: number[], mapRows: number, mapCols: number) =>
  r >= 0 && r < mapRows && c >= 0 && c < mapCols;

function part1(filename: string) {
  const guardMap = parseInput(filename);
  const [rows, cols] = [guardMap.length, guardMap[0].length];
  const coords = guardMap.flatMap((row, r) => row.map((_, c) => [r, c]));

  let [position] = coords.filter(
    ([r, c]) => guardMap[r][c] === Positions.Guard
  );
  let direction = Directions.Up;
  let visited = 0;

  printMap(guardMap, direction, filename.includes("full"));
  while (isInMap(position, rows, cols)) {
    const [r, c] = position;
    let { dr, dc } = direction;

    const potentialNewPos = [r + dr, c + dc];
    const [potentialNewR, potentialNewC] = potentialNewPos;

    visited = guardMap[r][c] !== Positions.Checked ? visited + 1 : visited;
    guardMap[r][c] = Positions.Checked;

    if (
      isInMap(potentialNewPos, rows, cols) &&
      guardMap[potentialNewR][potentialNewC] === Positions.Obstacle
    ) {
      direction = rotate(direction.name as DirectionName);
      ({ dr, dc } = direction);
    }

    printMap(guardMap, direction, filename.includes("full"));

    position = [r + dr, c + dc];
  }
  return visited;
}

function part2(filename: string) {
  const guardMapTemplate = parseInput(filename);
  const [rows, cols] = [guardMapTemplate.length, guardMapTemplate[0].length];
  const coords = guardMapTemplate.flatMap((row, r) =>
    row.map((_, c) => [r, c])
  );

  let loops = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Copy a new guard map because map will get marked during loop execution (could be improved)
      const guardMap = guardMapTemplate.map((row) => row.slice());

      // Can't replace the guard's starting position with an obstacle
      if (guardMap[i][j] === Positions.Guard) continue;

      // Add obstacle to current position
      guardMap[i][j] = Positions.Obstacle;

      let [position] = coords.filter(
        ([r, c]) => guardMap[r][c] === Positions.Guard
      );
      let direction = Directions.Up;

      // Set of positions used to check for loops
      const checkedPositions = new Set<string>();
      while (true) {
        // Each iteration, we EITHER move forward. If we can't move forward, we rotate.
        const [r, c] = position;
        const { dr, dc } = direction;
        const potentialNewPos = [r + dr, c + dc];
        const [potentialNewR, potentialNewC] = potentialNewPos;

        // If we arrive somewhere we've been before in a direction we already tried, count a loop and break
        if (checkedPositions.has([r, c, direction.name].join())) {
          loops++;
          break;
        }

        // If we've reached the edge of the map, exit without counting a loop
        if (!isInMap(potentialNewPos, rows, cols)) break;

        // If the space in front of us is not an obstacle, advance forward and continue
        if (guardMap[potentialNewR][potentialNewC] !== Positions.Obstacle) {
          // advance and continue
          position = [r + dr, c + dc];
          checkedPositions.add([r, c, direction.name].join());
          continue;
        }

        // If the space in front of us is an obstacle, turn right and try again
        if (guardMap[potentialNewR][potentialNewC] === Positions.Obstacle) {
          direction = rotate(direction.name as DirectionName);
        }
      }
    }
  }
  return loops;
}

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  // Part 1
    console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
    console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
