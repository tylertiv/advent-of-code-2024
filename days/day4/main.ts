import { getInputLines } from "../../lib/getInputLines.ts";

const part1 = (filename: string) => {
  const directions = [
    { dr: -1, dc: 0, _name: "up" },
    { dr: 1, dc: 0, _name: "down" },
    { dr: 0, dc: -1, _name: "left" },
    { dr: 0, dc: 1, _name: "right" },
    { dr: -1, dc: -1, _name: "upleft" },
    { dr: -1, dc: 1, _name: "upright" },
    { dr: 1, dc: -1, _name: "downleft" },
    { dr: 1, dc: 1, _name: "downright" },
  ];

  /**
   * Count the number of XMASes beginning at a specific position in the input
   *
   * @param r row index
   * @param c column index
   * @returns number of XMASes starting from row r, column c in the input
   */
  const countXmasesAtLocation = (r: number, c: number) =>
    // Optimization: Only run full check if starting position is the start of XMAS
    input[r][c] !== "X"
      ? 0
      : directions
          // Filter XMASes that go out of bounds of the input
          .filter(({ dr, dc }) => {
            const [lastRow, lastCol] = [r + 3 * dr, c + 3 * dc];
            return (
              lastRow >= 0 && lastRow < rows && lastCol >= 0 && lastCol < cols
            );
          })
          // Find valid XMASes
          .map(
            ({ dr, dc }) =>
              Array.from({ length: 4 }, (_, i) => [r + i * dr, c + i * dc])
                .map(([i, j]) => input[i][j])
                .join("")
            /*
                Alternatively, not functional, but 2-3x faster —
                let word = "";
                for (let i = 0; i < 4; i++) {
                    word += input[r + i * dr][c + i * dc];
                }
                return word;
            */
          )
          .filter((word) => word === "XMAS").length;

  const input = getInputLines(filename).map((line) => line.split(""));
  const [rows, cols] = [input.length, input[0].length];

  return input
    .flatMap((row, r) => row.map((_, c) => countXmasesAtLocation(r, c)))
    .reduce((sum, val) => sum + val);
};

function part2(filename: string) {
  const input = getInputLines(filename).map((line) => line.split(""));
  const [rows, cols] = [input.length, input[0].length];

  const isXmas = (r: number, c: number): boolean => {
    if (input[r][c] !== "A") return false;

    const diagonalOne = new Set([input[r - 1][c - 1], input[r + 1][c + 1]]);
    const diagonalTwo = new Set([input[r + 1][c - 1], input[r - 1][c + 1]]);

    return (
      diagonalOne.has("M") &&
      diagonalOne.has("S") &&
      diagonalTwo.has("M") &&
      diagonalTwo.has("S")
    );
  };

  return input
    .flatMap((row, r) => row.map((_, c) => ({ r, c })))
    .filter(({ r, c }) => r > 0 && r < rows - 1 && c > 0 && c <= cols - 1)
    .filter(({ r, c }) => isXmas(r, c)).length;
}

const solve = (inputFile: string) => ({
  part1: part1(inputFile),
  part2: part2(inputFile),
});

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;
  const testInput = `${inputPath}/test.txt`;
  const input = `${inputPath}/full.txt`;

  console.log("test input");
  console.log(solve(testInput));
  
  console.log("solution");
  console.log(solve(input));
}
