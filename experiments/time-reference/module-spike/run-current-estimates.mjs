import { inspectCurrentEstimateFixture } from "./current-estimates.js";

const result = await inspectCurrentEstimateFixture();
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
