# MakeAIP

AIP(Application Intent Protocol) 프로젝트를 시작하는 공식 Project Generator.
필요한 옵션을 고르면 바로 시작할 수 있는 AIP 프로젝트의 초기 구조를 만든다.

> 저장소 이름은 `Application-Intent-Protocol-Starter`지만 제품명은 **MakeAIP**이다.

## 상태

AIP Core 1.0(기준 커밋 `9431a68e`)의 최소 프로젝트를 만든다. 생성 직후 `aip service check`가 통과하고,
PostgreSQL에서 서비스를 띄운 뒤 TypeScript SDK 호출이 성공하는 것까지 확인한 구조다.

생성물: `app.aip`(정의), `service.json`(설정 템플릿), `package.json`(`@aip/sdk` 의존성과 `check`·`gen`·`setup`·`start`·`demo` 명령),
`db/seed.sql`, `scripts/dev-token.mjs`(개발용 토큰, Core `dev-jwt.mjs` 복사본), `client/main.ts`(SDK 호출 예제), README, `.gitignore`, 선택적 `AGENTS.md`.

- 선택 항목은 `Project name`과 `Agent instructions`뿐이다. Language·Runtime·Frontend·Database·Authentication은 옵션으로 열지 않는다.
  현재 템플릿이 고정한 조합은 PostgreSQL + TypeScript SDK + 개발용 토큰이다. 기준은 [docs/upstream.md](docs/upstream.md).
- npm 패키지(`@aip/sdk`)는 1.0 publish 전이고 이름은 Core 소유자 승인 대기다. publish 전에는 Core가 만든 tarball로 설치한다(생성된 README 참고).

## 구조

```
packages/generator   @makeaip/generator  옵션 → 파일 트리. 순수 함수, I/O 없음, 브라우저·Node 공용
packages/cli         @makeaip/cli        generator 결과를 디스크에 쓰는 얇은 어댑터
apps/web             @makeaip/web        MakeAIP Web. 브라우저에서 generator를 돌려 zip으로 내려준다
```

Web과 CLI는 같은 generator를 공유한다. 생성 로직은 generator에만 둔다. 이유는 [docs/architecture.md](docs/architecture.md).

## 개발

Node 22 이상과 pnpm이 필요하다.

```sh
pnpm install
pnpm test          # generator·cli 테스트
pnpm build
pnpm dev           # MakeAIP Web (Vite)
pnpm makeaip new my-aip-app --out /tmp/my-aip-app
```

### 생성물 검증

`pnpm test`는 `AIP_BIN`(Core에서 빌드한 `aip`)이 있으면 생성 직후 `aip service check app.aip`까지 확인하고, 없으면 그 검사만 건너뛴다.
서비스 실행과 SDK 호출까지 보는 전체 검사는 `scripts/e2e-generated.mjs`다. 필요한 환경 변수는 파일 머리말에 있다.
CI(`.github/workflows/ci.yml`)는 Core를 고정 커밋으로 받아 빌드하고 두 검사를 모두 실행한다.

```sh
AIP_BIN=/path/to/aip AIP_SDK_TARBALL=/path/to/aip-sdk-1.0.0.tgz \
AIP_E2E_DATABASE_URL=postgres://user@127.0.0.1:5432/disposable_db node scripts/e2e-generated.mjs
```

`AIP_E2E_DATABASE_URL`은 이 검사 전용 데이터베이스여야 한다. 실행마다 새 schema를 만들고 지우지 않는다.

## License

MIT
