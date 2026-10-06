import { agentsMd, GITIGNORE, readme } from "./templates.js";
import type { GeneratedFile, GenerationResult, ProjectInput, ProjectSpec } from "./types.js";

export class InvalidProjectInput extends Error {
  constructor(
    readonly field: keyof ProjectInput,
    message: string,
  ) {
    super(message);
    this.name = "InvalidProjectInput";
  }
}

// 디렉터리 이름과 npm 패키지 이름으로 그대로 쓸 수 있는 범위로 제한한다.
const PROJECT_NAME = /^[a-z0-9][a-z0-9._-]{0,63}$/;

export function resolveSpec(input: ProjectInput): ProjectSpec {
  const projectName = input.projectName.trim();
  if (!PROJECT_NAME.test(projectName)) {
    throw new InvalidProjectInput(
      "projectName",
      "projectName은 소문자·숫자로 시작하고 소문자·숫자·'.'·'_'·'-'만 쓸 수 있다(최대 64자).",
    );
  }
  return { projectName, agentInstructions: input.agentInstructions ?? true };
}

export function generate(input: ProjectInput): GenerationResult {
  const spec = resolveSpec(input);
  const files: GeneratedFile[] = [
    { path: "README.md", contents: readme(spec) },
    { path: ".gitignore", contents: GITIGNORE },
  ];
  if (spec.agentInstructions) {
    files.push({ path: "AGENTS.md", contents: agentsMd(spec) });
  }
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { spec, files };
}
