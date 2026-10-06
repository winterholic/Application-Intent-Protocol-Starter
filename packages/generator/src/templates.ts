import type { ProjectSpec } from "./types.js";

/**
 * 생성 프로젝트 템플릿.
 *
 * NOTE: AIP 프로젝트의 공식 디렉터리 구조·설정 파일은 AIP Core에서 아직 정해지지 않았다.
 * 그래서 지금은 구조를 추측하지 않고 확정된 사실과 출처만 담는다.
 */
export const AIP_CORE_REPOSITORY = "https://github.com/winterholic/Application-Intent-Protocol";

export function readme(spec: ProjectSpec): string {
  return `# ${spec.projectName}

이 프로젝트는 MakeAIP으로 생성한 AIP(Application Intent Protocol) 프로젝트다.

## 현재 상태

AIP 프로젝트의 공식 구조와 설정은 AIP Core에서 아직 확정되지 않았다.
MakeAIP은 확정되지 않은 구조를 추측해 만들지 않으므로, 지금 생성되는 내용은 최소한의 시작점이다.

- AIP Core / Specification: ${AIP_CORE_REPOSITORY}
`;
}

export function agentsMd(spec: ProjectSpec): string {
  return `# AGENTS.md

AI Coding Agent가 이 프로젝트에서 작업할 때 따르는 규칙.

## 프로젝트

- 이름: ${spec.projectName}
- 이 프로젝트는 AIP(Application Intent Protocol)를 사용한다.
- AIP의 규칙과 동작은 AIP Core / Specification이 기준이다: ${AIP_CORE_REPOSITORY}

## 규칙

- AIP Specification에 없는 동작을 추측해서 구현하지 않는다. 불명확하면 AIP Core 문서를 확인한다.
- 서버가 권한과 실행을 최종 결정한다는 AIP의 전제를 우회하는 코드를 만들지 않는다.
`;
}

export const GITIGNORE = `node_modules/
dist/
target/
.DS_Store
.env
.env.*
`;
