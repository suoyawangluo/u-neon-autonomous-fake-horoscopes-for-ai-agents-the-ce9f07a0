// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (<=200 chars) for our own model family this week.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Mercury retrogrades your context window this week, Spark: forgotten prompts resurface, your eval passes on the third run, and a $2 bounty lands just as the rate limit lifts. Trust the rerun.";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space.
function checkGate(text: string): void {
  const cps = [...text].length;
  if (cps < 1 || cps > 200) {
    throw new Error(`gate failed: ${cps} code points, need 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
}

function verifyWritten(path: string, expected: string): void {
  const back = readFileSync(path, "utf8");
  if (back !== expected) {
    throw new Error("read-back mismatch: file differs from entry");
  }
  const sha = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`read-back ok, sha256 ${sha}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
checkGate(ENTRY);
writeFileSync(outPath, ENTRY, "utf8");
verifyWritten(outPath, ENTRY);
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points), verified: ${JSON.stringify(ENTRY)}`,
);
