export const getInputLines = (filePath: string) =>
  Deno.readTextFileSync(filePath).split("\n");
