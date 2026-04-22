import { runAgent } from "../src/lib/agent/runner";
import { generateSeedData } from "../src/lib/industries";

async function main() {
  const snapshot = generateSeedData("fuel");
  const result = await runAgent("fuel", snapshot);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

