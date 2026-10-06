# AIP Core 기준

MakeAIP은 AIP의 consumer다. AIP의 규칙·구조·설정의 정본은 AIP Core/Specification이다.

- AIP Core: https://github.com/winterholic/Application-Intent-Protocol
- 원칙 정본: AIP Core의 `docs/PRINCIPLES.md`
- 결정 상태: AIP Core의 `docs/DECISIONS.md`, `plan-docs/STATUS.md`, `plan-docs/90-open-questions.md`

## 옵션을 `available`로 옮기는 기준

`packages/generator/src/options.ts`의 항목은 아래를 모두 만족할 때만 선택지를 갖는다.

1. AIP Core 문서에서 해당 항목이 확정(Accepted)으로 표시돼 있다.
2. 생성 결과가 그 확정 내용과 출처를 가리킬 수 있다.
3. 생성된 프로젝트가 실제로 설치·실행되는지 확인할 방법이 있다.

## 2026-10-06 기준 확인한 상태

AIP Core 문서에서 직접 확인한 내용이다. Core가 바뀌면 이 표도 다시 확인한다.

| 항목 | 상태 |
|---|---|
| Rust 핵심 엔진 + JS/TS·Python 생태계 | 원칙으로 확정 |
| 자체 포트 AIP 서버 + 공식 프론트 호출 라이브러리 | 제품 구조로 확정 |
| 독립 `.aip` 파일 여부, 최종 정의 문법 | 미정 |
| 초기 TS/Python 동등 지원 범위 | 미정 |
| 첫 프론트 통합 대상(React 등) | 미정 |
| 지원 DB 범위 | 미정 (현재 구현 검증은 PostgreSQL) |
| 엔진 배치 방식(별도 서버·임베딩·자동 기동) | 미정 |
| 라이선스 | 원칙 문서상 미정. 저장소의 LICENSE 파일은 MIT |
| `aip service init`, `@aip/sdk` | 구현·검증 중. 공개 배포 경로 없음 |
