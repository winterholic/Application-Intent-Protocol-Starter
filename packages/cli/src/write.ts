import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import type { GeneratedFile } from "@makeaip/generator";

export class TargetNotEmpty extends Error {
  constructor(readonly target: string) {
    super(`대상 디렉터리가 비어 있지 않다: ${target}`);
    this.name = "TargetNotEmpty";
  }
}

async function isEmptyOrMissing(dir: string): Promise<boolean> {
  try {
    return (await readdir(dir)).length === 0;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return true;
    throw error;
  }
}

/** 기존 파일을 덮어쓰지 않도록 비어 있거나 없는 디렉터리에만 쓴다. */
export async function writeProject(target: string, files: readonly GeneratedFile[]): Promise<void> {
  const root = resolve(target);
  if (!(await isEmptyOrMissing(root))) throw new TargetNotEmpty(root);
  for (const file of files) {
    const path = resolve(join(root, file.path));
    // generator가 상대 경로만 내도록 보장하지만, 디스크에 쓰는 쪽에서 한 번 더 막는다.
    if (!path.startsWith(root + sep)) throw new Error(`프로젝트 밖 경로: ${file.path}`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, file.contents, { flag: "wx" });
  }
}
