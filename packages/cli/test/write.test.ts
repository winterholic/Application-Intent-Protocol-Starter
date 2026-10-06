import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generate } from "@makeaip/generator";
import { TargetNotEmpty, writeProject } from "../src/write.js";

let base: string;
beforeEach(async () => {
  base = await mkdtemp(join(tmpdir(), "makeaip-"));
});
afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe("writeProject", () => {
  it("generator 결과를 그대로 디스크에 쓴다", async () => {
    const { files } = generate({ projectName: "demo" });
    const target = join(base, "demo");
    await writeProject(target, files);
    expect((await readdir(target)).sort()).toEqual(files.map((f) => f.path).sort());
    expect(await readFile(join(target, "README.md"), "utf8")).toBe(files.find((f) => f.path === "README.md")?.contents);
  });

  it("비어 있지 않은 디렉터리에는 쓰지 않는다", async () => {
    await writeFile(join(base, "keep.txt"), "x");
    await expect(writeProject(base, generate({ projectName: "demo" }).files)).rejects.toThrow(TargetNotEmpty);
    expect(await readdir(base)).toEqual(["keep.txt"]);
  });

  it("프로젝트 밖 경로를 거부한다", async () => {
    await expect(writeProject(join(base, "p"), [{ path: "../evil", contents: "" }])).rejects.toThrow();
  });
});
