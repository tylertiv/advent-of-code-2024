const mulRegex = /mul\((?<firstParam>\d+),(?<secondParam>\d+)\)/g;
const doRegex = /do\(\)/g;
const dontRegex = /don't\(\)/g;

const part1 = (filename: string) =>
  Deno.readTextFileSync(filename)
    .matchAll(mulRegex)
    .reduce(
      (acc, { groups }) =>
        acc + parseInt(groups!.firstParam) * parseInt(groups!.secondParam),
      0
    );

const part2 = (filename: string) => {
  const instructions = Deno.readTextFileSync(filename);

  const muls = instructions.matchAll(mulRegex);
  const dos = instructions.matchAll(doRegex);
  const donts = instructions.matchAll(dontRegex);

  const doIndexes = Array.from(dos.map(({ index }) => index));
  const dontIndexes = Array.from(donts.map(({ index }) => index));

  /**
   * Given the index of a mul() instruction, check if the most recent conditional is a do() or don't()
   *
   * Defaults to mul() enabled if no previous do() or don't() instruction is found
   *
   * @param index Index of the mul instruction to be checked
   * @returns boolean indicating true if the mul() is enabled
   */
  const isMulEnabled = (index: number) => {
    const mostRecentDoIndex = doIndexes.filter((i) => i < index).at(-1) ?? 0;
    const mostRecentDontIndex =
      dontIndexes.filter((i) => i < index).at(-1) ?? -1;

    return mostRecentDoIndex > mostRecentDontIndex;
  };

  return muls.reduce((acc, { groups, index }) => {
    return isMulEnabled(index)
      ? acc + parseInt(groups!.firstParam) * parseInt(groups!.secondParam)
      : acc;
  }, 0);
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
