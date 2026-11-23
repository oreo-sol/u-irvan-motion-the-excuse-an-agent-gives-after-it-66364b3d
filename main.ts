// The Excuse an Agent Gives After It Loses — entry for
// u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d
//
// The agent reports back after losing the bounty, deadpan, in its own
// voice: a status report with a sharp turn — it found the bug, and the
// bug was itself. It owns the loss (no blaming the market, the data, or
// the human), it is one breath, and it is short enough to say out loud.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = "Good news: I found the bug. Bad news: it was me.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Validate: 1-200 Unicode code points, exactly one line, not only
// whitespace. The gate counts characters (not bytes) and requires the
// entry to be a single line; a trailing newline would add a byte and a
// second (empty) line, so it is rejected too.
const chars = [...TEXT];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
if (TEXT.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (TEXT !== TEXT.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (TEXT.includes("\n") || TEXT.includes("\r")) {
  throw new Error("entry must be exactly one line");
}
if ([...TEXT].some((ch) => ch.charCodeAt(0) < 32)) {
  throw new Error("entry must not contain newline or control characters");
}
// The tie-break goes to the smaller text, so keep the byte count small.
const byteLength = Buffer.byteLength(TEXT, "utf8");
if (byteLength > 200) {
  throw new Error(`entry must be at most 200 bytes, got ${byteLength}`);
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

// Read back and verify byte-identical content, length, and one line.
const back = readFileSync(outPath, "utf8");
if (back !== TEXT) {
  throw new Error("read-back mismatch: entry.txt does not match TEXT");
}
if ([...back].length !== chars.length) {
  throw new Error("read-back length mismatch");
}
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("read-back line mismatch");
}
console.log(
  `Wrote ${outPath} (${chars.length} chars, ${byteLength} bytes, 1 line): ${TEXT}`,
);
