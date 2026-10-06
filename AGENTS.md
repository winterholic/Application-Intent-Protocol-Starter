# AGENTS.md

이 저장소에서 작업하는 사람과 AI Coding Agent가 따르는 기준.

## 이 저장소는 무엇인가

- GitHub 저장소: `Application-Intent-Protocol-Starter`
- 제품명·UI 명칭: **MakeAIP**. "Starter"는 저장소 구분용 이름이며 사용자에게 노출하지 않는다.
- 역할: AIP(Application Intent Protocol) 프로젝트를 시작하는 가장 쉽고 공식적인 방법. Spring Initializr와 비슷한 Project Generator다.
- 목표 흐름: MakeAIP → 옵션 선택 → 프로젝트 생성 → dependency 설치 → 실행.

## 책임의 경계

- 이 저장소는 AIP Runtime이나 Protocol을 구현하지 않는다.
- AIP Core/Specification이 source of truth다: https://github.com/winterholic/Application-Intent-Protocol
- AIP Core의 기능을 여기서 재정의하거나 별도 AIP 규칙을 만들지 않는다.
- AIP Core에서 확정되지 않은 옵션·구조를 추측해 구현하지 않는다. 미정 항목은 `pending-core`로 둔다.
  확정 기준과 현재 상태는 [docs/upstream.md](docs/upstream.md).

## 설계 원칙

- 생성 로직은 `packages/generator`에만 둔다. Web·CLI는 어댑터다. [docs/architecture.md](docs/architecture.md)
- generator는 순수 함수다. I/O·시간·난수에 의존하지 않고, 같은 입력이면 같은 출력이 나온다.
- 기본값이 명확해야 하고 설정은 최소여야 하며 생성 구조는 예측 가능해야 한다.
- 생성된 프로젝트는 사람과 AI Coding Agent가 바로 구조와 규칙을 이해할 수 있어야 한다.
- 생성 결과는 특정 AI 제품에 종속되지 않는다. 기본 agent 지침은 `AGENTS.md`로 만든다.

## 작업 방법

```sh
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

옵션이나 템플릿을 바꾸면 `packages/generator/test`에 기대 결과를 함께 고정한다.
