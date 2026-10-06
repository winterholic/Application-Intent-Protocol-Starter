/**
 * MakeAIP이 사용자에게 보여줄 선택 항목 목록.
 *
 * NOTE: AIP Core/Specification이 아직 확정하지 않은 항목은 `pending-core`로 두고
 * 선택지를 만들지 않는다. 여기서 선택지를 임의로 정하면 MakeAIP이 AIP 규칙을
 * 재정의하는 셈이 된다. Core에서 확정되면 그때 `available`로 옮긴다.
 */
export type OptionStatus = "available" | "pending-core";

export type OptionKind = "text" | "boolean" | "choice";

export interface OptionChoice {
  readonly value: string;
  readonly label: string;
}

export interface OptionDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly kind: OptionKind;
  readonly status: OptionStatus;
  readonly default?: string | boolean;
  readonly choices?: readonly OptionChoice[];
}

export const OPTION_CATALOG: readonly OptionDefinition[] = [
  {
    id: "projectName",
    label: "Project name",
    description: "생성할 디렉터리와 프로젝트의 이름.",
    kind: "text",
    status: "available",
    default: "my-aip-app",
  },
  {
    id: "agentInstructions",
    label: "Agent instructions",
    description:
      "AI Coding Agent가 읽을 AGENTS.md를 함께 생성한다. 특정 AI 제품 전용 파일은 만들지 않는다.",
    kind: "boolean",
    status: "available",
    default: true,
  },
  {
    id: "language",
    label: "Language",
    description: "정의·확장 작성 언어(JS/TS·Python). 초기 지원 범위는 AIP Core에서 미정.",
    kind: "choice",
    status: "pending-core",
  },
  {
    id: "runtime",
    label: "Runtime",
    description: "AIP 엔진의 실행·배치 방식. AIP Core에서 미정.",
    kind: "choice",
    status: "pending-core",
  },
  {
    id: "frontend",
    label: "Frontend integration",
    description: "공식 프론트 라이브러리의 첫 통합 대상. AIP Core에서 미정.",
    kind: "choice",
    status: "pending-core",
  },
  {
    id: "database",
    label: "Database",
    description: "지원 DB 범위. AIP Core에서 미정.",
    kind: "choice",
    status: "pending-core",
  },
  {
    id: "authentication",
    label: "Authentication",
    description: "인증 제공자 연결 방식. AIP Core에서 미정.",
    kind: "choice",
    status: "pending-core",
  },
];

export function availableOptions(): readonly OptionDefinition[] {
  return OPTION_CATALOG.filter((option) => option.status === "available");
}
