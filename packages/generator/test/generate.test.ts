import { describe, expect, it } from "vitest";
import { AIP_SDK_PACKAGE, generate, InvalidProjectInput, OPTION_CATALOG, schemaName } from "../src/index.js";

const file = (name: string, path: string): string => {
  const found = generate({ projectName: name }).files.find((f) => f.path === path);
  if (!found) throw new Error(`생성 결과에 ${path}가 없다`);
  return found.contents;
};

describe("schemaName", () => {
  it.each([
    ["demo", "aip_demo"],
    ["my.demo-app", "aip_my_demo_app"],
    ["x".repeat(64), `aip_${"x".repeat(59)}`],
  ])("%j → %j", (name, expected) => {
    expect(schemaName(name)).toBe(expected);
    expect(schemaName(name)).toMatch(/^aip_[a-z0-9_]+$/);
    expect(schemaName(name).length).toBeLessThanOrEqual(63);
  });
});

describe("generate", () => {
  it("같은 입력이면 같은 결과를 낸다", () => {
    expect(generate({ projectName: "demo" })).toEqual(generate({ projectName: "demo" }));
  });

  it("기본값으로 AGENTS.md를 포함하고 경로순으로 정렬한다", () => {
    const paths = generate({ projectName: "demo" }).files.map((f) => f.path);
    expect(paths).toEqual([
      ".gitignore",
      "AGENTS.md",
      "README.md",
      "app.aip",
      "client/main.ts",
      "db/seed.sql",
      "package.json",
      "scripts/dev-token.mjs",
      "service.json",
    ]);
  });

  it("package.json은 SDK 의존성과 시작·검증 명령을 담는다", () => {
    const pkg = JSON.parse(file("demo", "package.json"));
    expect(pkg.dependencies[AIP_SDK_PACKAGE]).toMatch(/^\^1\./);
    expect(Object.keys(pkg.scripts)).toEqual(
      expect.arrayContaining(["check", "gen", "setup", "start", "demo", "db:init", "db:seed", "idp"]),
    );
    expect(pkg.scripts.check).toBe("aip service check app.aip");
    expect(pkg.scripts.gen).toContain(`--sdk-import ${AIP_SDK_PACKAGE}`);
  });

  it("service.json과 seed.sql이 같은 schema를 쓰고 비밀을 담지 않는다", () => {
    const config = JSON.parse(file("my.demo-app", "service.json"));
    expect(config.schema).toBe("aip_my_demo_app");
    expect(config.database_url_env).toBe("AIP_DATABASE_URL");
    expect(file("my.demo-app", "db/seed.sql")).toContain("aip_my_demo_app.member");
    expect(JSON.stringify(config)).not.toMatch(/postgres:\/\/|password|secret/i);
  });

  it("개인키와 연결 문자열 파일을 커밋하지 않게 한다", () => {
    const ignore = file("demo", ".gitignore");
    for (const entry of ["dev-idp/", ".env", "client/binding.ts"]) expect(ignore).toContain(entry);
  });

  it("agentInstructions=false면 AGENTS.md를 만들지 않는다", () => {
    const paths = generate({ projectName: "demo", agentInstructions: false }).files.map((f) => f.path);
    expect(paths).not.toContain("AGENTS.md");
  });

  it("특정 AI 제품 전용 파일을 만들지 않는다", () => {
    const paths = generate({ projectName: "demo" }).files.map((f) => f.path);
    expect(paths).not.toContain("CLAUDE.md");
  });

  it.each(["", "Demo", "../escape", "a/b", "-lead", "x".repeat(65)])("잘못된 이름 %j를 거부한다", (name) => {
    expect(() => generate({ projectName: name })).toThrow(InvalidProjectInput);
  });
});

describe("OPTION_CATALOG", () => {
  it("Core 미정 항목은 선택지를 갖지 않는다", () => {
    for (const option of OPTION_CATALOG.filter((o) => o.status === "pending-core")) {
      expect(option.choices).toBeUndefined();
    }
  });

  it("id가 중복되지 않는다", () => {
    const ids = OPTION_CATALOG.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
