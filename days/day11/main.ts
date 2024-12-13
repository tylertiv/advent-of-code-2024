const blinkAtStone = (
  numberOnStone: number,
  timesToBlink: number,
  cache: Record<string, number> = {}
): number => {
  // Cache: if we've seen a stoneNumber with same num of blinks remaining
  // we know what the resulting number of stones will be
  if (cache[`${numberOnStone},${timesToBlink}`])
    return cache[`${numberOnStone},${timesToBlink}`];

  // Base case: if we dont' blink at a stone, it will remain one stone
  if (timesToBlink === 0) return 1;

  // Blinking at a 0 turns it into 1 stone with a 1
  if (numberOnStone === 0) return blinkAtStone(1, timesToBlink - 1, cache);

  // Blinking at an odd length stone turns it into 1 stone with 2024x stone number
  if (numberOnStone.toString().length % 2 !== 0)
    return blinkAtStone(2024 * numberOnStone, timesToBlink - 1, cache);

  const n = numberOnStone.toString();
  // Blinking at an even length stone turns it into 2 stones, with number split in half
  // Cache result before retuning
  return (cache[`${numberOnStone},${timesToBlink}`] =
    blinkAtStone(parseInt(n.slice(0, n.length / 2)), timesToBlink - 1, cache) +
    blinkAtStone(
      parseInt(n.slice(n.length / 2, n.length)),
      timesToBlink - 1,
      cache
    ));
};

const _part1_attempt1 = (filename: string) => {
  const input = Deno.readTextFileSync(filename).split(" ").map(Number);

  let nums = input;
  let newNums = input.slice();

  for (let i = 0; i < 30; i++) {
    let spacesAdded = 0;

    for (let j = 0; j < nums.length; j++) {
      const n = nums[j].toString();
      if (nums[j] === 0) newNums[j + spacesAdded] = 1;
      else if (n.length % 2 === 0) {
        newNums.splice(
          j + spacesAdded,
          1,
          ...[
            parseInt(n.slice(0, n.length / 2)),
            parseInt(n.slice(n.length / 2)),
          ]
        );
        spacesAdded += 1;
      } else {
        newNums[j + spacesAdded] = nums[j] * 2024;
      }
    }

    nums = newNums;
    newNums = nums.slice();
  }
  return nums.length;
};

const part1 = (filename: string) =>
  Deno.readTextFileSync(filename)
    .split(" ")
    .map(Number)
    .map((stoneNum) => blinkAtStone(stoneNum, 25))
    .reduce((sum, numStones) => sum + numStones);

const part2 = (filename: string) =>
  Deno.readTextFileSync(filename)
    .split(" ")
    .map(Number)
    .map((stoneNum) => blinkAtStone(stoneNum, 75))
    .reduce((sum, numStones) => sum + numStones);

if (import.meta.main) {
  const inputPath = `${import.meta.dirname}/input`;

  //   console.time("attempt1");
  //   part1_attempt1(`${inputPath}/full.txt`);
  //   console.timeEnd("attempt1");

  console.time("attempt2");
  part1(`${inputPath}/full.txt`);
  console.timeEnd("attempt2");

  // Part 1
  console.log(`part1 testInput: ${part1(`${inputPath}/test.txt`)}`);
  console.log(`part1 input: ${part1(`${inputPath}/full.txt`)}`);

  // Part 2
  console.log(`part2 testInput: ${part2(`${inputPath}/test.txt`)}`);
  console.log(`part2 input: ${part2(`${inputPath}/full.txt`)}`);
}
