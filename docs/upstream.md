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

## 2026-11-21 기준 확인한 상태

CI는 출시 후보 `4e132564`에서 생성 프로젝트를 실행한다. Core 기준이 바뀌면 이 표와 `.github/workflows/ci.yml`의 `CORE_REF`를 함께 올린다.

| 항목 | 상태 | 이 저장소의 사용 |
|---|---|---|
| 독립 `.aip` 정의 파일, `aip service check/init/gen/serve` | 동작 확인 | 생성물의 `app.aip`와 npm 명령 |
| 지원 DB | 문서·검증은 PostgreSQL 17 | 템플릿 고정. 옵션으로 열지 않는다 |
| TypeScript SDK `@aip/sdk` | 1.0.0 tarball로 설치·호출 확인. **publish 전**, 이름은 소유자 승인 대기(`product/release.config.json`의 `namesApprovedByOwner: false`) | `package.json` 의존성 `^1.0.0`. 이름은 `AIP_SDK_PACKAGE` 한 곳 |
| Python SDK `application-intent-protocol-sdk` | Core에 있음 | 생성하지 않는다 |
| 개발용 토큰 `product/tools/dev-jwt.mjs` | Core 저장소 안의 도구. 릴리스 산출물 경로 미확정 | 원문 복사(`packages/generator/src/dev-jwt.ts`). e2e가 Core와 같은지 대조 |
| `aip` CLI 배포 | 1.0 릴리스 전. 소스 빌드만 가능(`cargo build -p aip-cli --release`) | 생성 README가 사전 요건으로 안내 |
| 프론트 통합, 인증 제공자 연결, 확장(worker) | 이 템플릿 범위 밖 | 열지 않는다(`pending-core` 유지) |
| 라이선스 | 원칙 문서상 미정. 저장소의 LICENSE 파일은 MIT | 변경 없음 |

## 2026-10-06 기준 확인한 상태 (이전 기록)

| 항목 | 상태 |
|---|---|
| Rust 핵심 엔진 + JS/TS·Python 생태계 | 원칙으로 확정 |
| 자체 포트 AIP 서버 + 공식 프론트 호출 라이브러리 | 제품 구조로 확정 |
| 독립 `.aip` 파일 여부, 최종 정의 문법 | 미정 (2026-11-21 기준 위 표로 대체) |
| 초기 TS/Python 동등 지원 범위 | 미정 |
| 첫 프론트 통합 대상(React 등) | 미정 |
| 지원 DB 범위 | 미정 (현재 구현 검증은 PostgreSQL) |
| 엔진 배치 방식(별도 서버·임베딩·자동 기동) | 미정 |
| 라이선스 | 원칙 문서상 미정. 저장소의 LICENSE 파일은 MIT |
| `aip service init`, `@aip/sdk` | 구현·검증 중. 공개 배포 경로 없음 |
