const parseInput = (filename: string) =>
  Deno.readTextFileSync(filename)
    .split("\n\n")
    .map((arr) => arr.split("\n"));

/**
 * Parses a list of rules into a RulesObject
 *
 * @param rules list of rules, where a rule in the form a|b, which indicates that a must come before b in the update
 * @returns a RulesObject where the key is a page, and the value is a set of pages that must come before that page
 */
const parseRules = (rules: string[]) =>
  rules.reduce((obj: Record<string, Set<string>>, rule) => {
    const [before, after] = rule.split("|");
    return {
      ...obj,
      [after]: obj[after] ? obj[after].add(before) : new Set([before]),
    };
  }, {});

const parseUpdates = (updates: string[]) =>
  updates.map((update) => update.split(","));

const isValidUpdate = (pages: string[], rulesObj: Record<string, Set<string>>) =>
  pages.every((page, i, pages) => {
    const remaining = new Set(pages.slice(i + 1));
    return remaining.intersection(rulesObj[page] ?? new Set()).size === 0;
  });

// Assumes we will always have an odd number of pages and an a middle element
const getMiddlePage = <T>(arr: T[]) => arr[Math.floor(arr.length / 2)];

const part1 = (filename: string) => {
  const [ruleStrings, updateStrings] = parseInput(filename);
  const updates = parseUpdates(updateStrings);
  const rulesObj = parseRules(ruleStrings);

  const validUpdates = updates.filter((pages) => isValidUpdate(pages, rulesObj));

  return validUpdates
    .map(updates => getMiddlePage(updates))
    .reduce((sum, val) => sum + parseInt(val), 0);
};

const part2 = (filename: string) => {
  const [ruleStrings, updateStrings] = parseInput(filename);
  const updates = parseUpdates(updateStrings);
  const rulesObj = parseRules(ruleStrings);

  const invalidUpdates = updates.filter(
    (pages) => !isValidUpdate(pages, rulesObj)
  );

  return invalidUpdates
    .map((update) =>
      update.sort((first, second) => {
        const shouldComeBeforeFirst = rulesObj[first] ?? new Set();
        const shouldComeBeforeSecond = rulesObj[second] ?? new Set();

        if (shouldComeBeforeFirst.has(second)) return 1;
        if (shouldComeBeforeSecond.has(first)) return -1;
        return 0;
      })
    )
    .map(updates => getMiddlePage(updates))
    .reduce((sum, val) => sum + parseInt(val), 0);
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
