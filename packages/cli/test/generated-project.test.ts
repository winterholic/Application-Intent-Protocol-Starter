import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generate } from "@makeaip/generator";
import { writeProject } from "../src/write.js";

const run = promisify(execFile);

// Core에서 빌드한 `aip` 실행 파일 경로. CI는 항상 지정하고, 로컬에서 없으면 이 검사만 건너뛴다.
const AIP_BIN = process.env.AIP_BIN;

let base: string;
let project: string;
beforeEach(async () => {
  base = await mkdtemp(join(tmpdir(), "makeaip-generated-"));
  project = join(base, "demo-app");
  await writeProject(project, generate({ projectName: "demo-app" }).files);
});
afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

const aipCheck = (dir: string) => run(AIP_BIN!, ["service", "check", "app.aip"], { cwd: dir });

describe("생성 직후 프로젝트", () => {
  it("디스크에 쓴 파일이 시작에 필요한 최소 구성이다", async () => {
    const { files } = generate({ projectName: "demo-app" });
    expect(files.map((f) => f.path)).toEqual(
      expect.arrayContaining(["app.aip", "service.json", "package.json", "db/seed.sql", "scripts/dev-token.mjs", "client/main.ts"]),
    );
    expect(await readFile(join(project, "app.aip"), "utf8")).toContain("resource Task");
  });

  it.skipIf(!AIP_BIN)("`aip service check app.aip`가 통과한다", async () => {
    const { stdout } = await aipCheck(project);
    expect(JSON.parse(stdout)).toMatchObject({ ok: true });
  });

  it.skipIf(!AIP_BIN)("정의를 망가뜨리면 check가 실패한다(검사가 실제로 정의를 본다)", async () => {
    await writeFile(join(project, "app.aip"), "resource Task { fields { id: Id; title: Nope } }\n");
    await expect(aipCheck(project)).rejects.toMatchObject({ code: expect.any(Number) });
  });
});
