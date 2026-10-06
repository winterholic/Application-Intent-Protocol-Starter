#!/usr/bin/env node
import { parseArgs } from "node:util";
import { generate, InvalidProjectInput, OPTION_CATALOG } from "@makeaip/generator";
import { TargetNotEmpty, writeProject } from "./write.js";

const USAGE = `Usage:
  makeaip new <project-name> [--out <dir>] [--no-agent-instructions]
  makeaip options`;

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      out: { type: "string" },
      "no-agent-instructions": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  const [command, name] = positionals;

  if (values.help || !command) {
    console.log(USAGE);
    return values.help ? 0 : 1;
  }

  if (command === "options") {
    for (const option of OPTION_CATALOG) {
      const status = option.status === "available" ? "" : "  (AIP Core 확정 대기)";
      console.log(`${option.id.padEnd(18)} ${option.label}${status}`);
    }
    return 0;
  }

  if (command === "new" && name) {
    const result = generate({ projectName: name, agentInstructions: !values["no-agent-instructions"] });
    const target = values.out ?? result.spec.projectName;
    await writeProject(target, result.files);
    console.log(`Created ${result.spec.projectName} (${result.files.length} files) in ${target}`);
    return 0;
  }

  console.error(USAGE);
  return 1;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error: unknown) => {
    if (error instanceof InvalidProjectInput || error instanceof TargetNotEmpty) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  },
);
