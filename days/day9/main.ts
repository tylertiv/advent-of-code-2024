const parseInput = (filename: string) =>
  Deno.readTextFileSync(filename)
    .split("")
    .flatMap(
      (n, i) =>
        Array.from({ length: parseInt(n) }).fill(
          i % 2 === 0 ? (i / 2).toString() : "."
        ) as string[]
    );

function part1(filename: string) {
  const disk = parseInput(filename);

  let nextSpaceIndex = disk.indexOf(".");
  let lastDigitIndex = disk.findLastIndex((spot) => spot !== ".");

  while (nextSpaceIndex < lastDigitIndex) {
    // Swap empty spot with data
    [disk[nextSpaceIndex], disk[lastDigitIndex]] = [
      disk[lastDigitIndex],
      disk[nextSpaceIndex],
    ];
    nextSpaceIndex = disk.indexOf(".", nextSpaceIndex + 1);
    lastDigitIndex = disk
      .slice(0, lastDigitIndex)
      .findLastIndex((spot) => spot !== ".");
  }

  return (
    disk
      .slice(0, disk.indexOf("."))
      .map(Number)
      .reduce((sum, val, i) => sum + val * i)
  );
}

const isEnoughSpace = (disk: string[], i: number, length: number) =>
  disk.slice(i, i + length).every((val) => val === ".");

const getFileSizes = (disk: string[]) =>
  disk
    .filter((spot) => spot !== ".")
    .reduce(
      (acc: Record<string, number>, value) => ({
        ...acc,
        [value]: (acc[value] ?? 0) + 1,
      }),
      {}
    );

function part2(filename: string) {
  const disk = parseInput(filename);

  const fileSizes = getFileSizes(disk);

  Object.entries(fileSizes)
    .reverse()
    .forEach(([fileId, fileSize]) => {
      const fileStart = disk.indexOf(fileId);

      for (let i = 0; i < fileStart; i++) {
        if (disk[i] === "." && isEnoughSpace(disk, i, fileSize)) {
          // Put file contents into open space
          disk.splice(
            i,
            fileSize,
            ...(Array.from({ length: fileSize }).fill(fileId) as string[])
          );
          // Replace file with empty space
          disk.splice(
            fileStart,
            fileSize,
            ...(Array.from({ length: fileSize }).fill(".") as string[])
          );
          break;
        }
      }
    });

  return disk
    .map((val) => (val === "." ? 0 : parseInt(val)))
    .reduce((sum, val, i) => sum + val * i);
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
