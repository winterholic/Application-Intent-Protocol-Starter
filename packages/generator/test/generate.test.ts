import { describe, expect, it } from "vitest";
import { generate, InvalidProjectInput, OPTION_CATALOG } from "../src/index.js";

describe("generate", () => {
  it("같은 입력이면 같은 결과를 낸다", () => {
    expect(generate({ projectName: "demo" })).toEqual(generate({ projectName: "demo" }));
  });

  it("기본값으로 AGENTS.md를 포함하고 경로순으로 정렬한다", () => {
    const paths = generate({ projectName: "demo" }).files.map((f) => f.path);
    expect(paths).toEqual([".gitignore", "AGENTS.md", "README.md"]);
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
