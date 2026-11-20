import type { ProjectSpec } from "./types.js";

/**
 * 생성 프로젝트 템플릿.
 *
 * NOTE: 정의 문법·설정·명령은 AIP Core(1.0, origin/main 9431a68e)가 정본이다. 여기서 규칙을 만들지 않고
 * Core 문서(product/GETTING-STARTED.md)의 흐름을 최소 프로젝트로 옮긴다. 생성물의 동작은
 * `scripts/e2e-generated.mjs`가 Core에서 빌드한 `aip`와 임시 PostgreSQL로 확인한다.
 */
export const AIP_CORE_REPOSITORY = "https://github.com/winterholic/Application-Intent-Protocol";

/**
 * npm SDK 이름과 범위. 1.0 publish 전이고 이름은 Core 소유자 승인 대기다(product/release.config.json).
 * 바뀌면 이 상수만 고친다. 생성 binding의 `--sdk-import`도 같은 값을 쓴다.
 */
export const AIP_SDK_PACKAGE = "@aip/sdk";
export const AIP_SDK_RANGE = "^1.0.0";

export const DEV_SUBJECT = "dev-user-1";

/** 서비스 schema 이름은 `aip_`로 시작하는 소문자 ASCII 식별자, 63바이트 이하여야 한다(Core GETTING-STARTED). */
export function schemaName(projectName: string): string {
  return `aip_${projectName.replace(/[^a-z0-9]/g, "_")}`.slice(0, 63);
}

export function readme(spec: ProjectSpec): string {
  return `# ${spec.projectName}

MakeAIP으로 생성한 AIP(Application Intent Protocol) 프로젝트다. 정의 파일 하나(\`app.aip\`)가 서버의 읽기·쓰기·권한 규칙이고 서버 코드는 없다.

## 준비물

- \`aip\` CLI (AIP Core 1.0): ${AIP_CORE_REPOSITORY}. 릴리스 전에는 Core를 \`cargo build -p aip-cli --release\`로 빌드해 \`PATH\`에 둔다.
- Node.js 26 이상 (\`client/main.ts\`를 \`node\`로 바로 실행한다)
- PostgreSQL 17과 \`psql\`. **이 프로젝트 전용 데이터베이스**를 쓴다.

## 시작

\`\`\`sh
# 전용 데이터베이스의 연결 문자열. 비밀번호는 셸에만 두고 파일에 쓰지 않는다.
export AIP_DATABASE_URL='postgres://user:password@127.0.0.1:5432/my_database'

npm install        # ${AIP_SDK_PACKAGE} 설치 (1.0 publish 전에는 아래 "SDK 설치" 참고)
npm run check      # 정의 검사: aip service check app.aip
npm run setup      # 개발용 키 생성, binding 생성, DB schema 생성, 사용자 연결
npm start          # 서버 시작 (127.0.0.1:8080), 이 터미널을 점유한다
\`\`\`

다른 터미널에서:

\`\`\`sh
npm run demo       # SDK로 Task 생성 → 완료 처리 → 조회
\`\`\`

\`/ready\`가 200이면 정의와 DB 구조 검사를 통과한 것이다: \`curl -s localhost:8080/ready\`.

## 구성

| 파일 | 역할 |
|---|---|
| \`app.aip\` | 정의. \`Task\` 읽기·생성·완료 전이와 소유자 권한 |
| \`service.json\` | 서비스 설정 템플릿. schema \`${schemaName(spec.projectName)}\`, 개발용 JWKS 경로 |
| \`db/seed.sql\` | 개발용 사용자(actor 행) 1명 |
| \`scripts/dev-token.mjs\` | 개발용 토큰 발급기. Core의 \`dev-jwt.mjs\` 복사본이며 **운영에 쓰지 않는다** |
| \`client/main.ts\` | SDK 호출 예제 |
| \`client/binding.ts\` | \`npm run gen\`이 정의에서 만든다. 커밋하지 않는다 |

## 명령

| 명령 | 하는 일 |
|---|---|
| \`npm run check\` | \`aip service check app.aip\`. 정의 오류를 \`DEF.*\` 코드로 알려 준다 |
| \`npm run gen\` | \`aip service gen\`으로 \`client/binding.ts\`를 만든다. 정의를 바꾸면 다시 실행한다 |
| \`npm run idp\` | \`dev-idp/\`에 개발용 키와 JWKS를 만든다 |
| \`npm run db:init\` | 새 schema에 테이블을 만든다. 이미 있는 schema에는 쓰지 않는다 |
| \`npm run db:seed\` | 사용자 행을 넣고 토큰의 subject(\`${DEV_SUBJECT}\`)를 그 사용자에 연결한다 |
| \`npm run setup\` | \`idp\`, \`gen\`, \`db:init\`, \`db:seed\`를 순서대로 실행한다 |
| \`npm start\` | \`aip service serve\` |
| \`npm run demo\` | 개발 토큰을 발급해 \`client/main.ts\`를 실행한다 |

## SDK 설치

1.0이 publish되면 \`npm install\`이 \`${AIP_SDK_PACKAGE}\`를 받는다. 그 전에는 Core의 \`node product/tools/package.mjs --out <새 디렉터리>\`가 만든 \`sdk/aip-sdk-<version>.tgz\`로 설치한다.

\`\`\`sh
npm install --no-save --ignore-scripts /path/to/aip-sdk-1.0.0.tgz
\`\`\`

패키지 이름은 Core 소유자 승인 전이라 바뀔 수 있다. 바뀌면 \`package.json\`, \`client/main.ts\`, \`npm run gen\`의 \`--sdk-import\`를 함께 고친다.

## 다음으로

- 정의 문법: Core의 \`spec/definition-syntax.md\`, 진단 코드는 \`aip explain-code DEF.<코드>\`
- 운영 인증·TLS·배포: Core의 \`product/OPERATIONS.md\`, \`product/IDP-RUNBOOK.md\`
- 개발용 토큰(\`scripts/dev-token.mjs\`)과 \`trust\` 인증 DB는 로컬 개발 전용이다.
`;
}

export function agentsMd(spec: ProjectSpec): string {
  return `# AGENTS.md

AI Coding Agent가 이 프로젝트에서 작업할 때 따르는 규칙.

## 프로젝트

- 이름: ${spec.projectName}
- AIP(Application Intent Protocol) 프로젝트다. 정의 \`app.aip\`가 서버의 읽기·쓰기·권한을 정한다. 서버 코드는 없다.
- AIP의 규칙과 동작은 AIP Core / Specification이 기준이다: ${AIP_CORE_REPOSITORY}

## 명령

- \`npm run check\`: 정의 검사. \`app.aip\`를 고친 뒤 항상 실행한다.
- \`npm run gen\`: \`client/binding.ts\` 재생성. 정의를 바꾸면 실행하고 binding은 손으로 고치지 않는다.
- \`npm run setup\`, \`npm start\`, \`npm run demo\`: 로컬 실행. \`AIP_DATABASE_URL\`이 필요하다. README 참고.

## 규칙

- AIP Specification에 없는 동작을 추측해서 구현하지 않는다. 불명확하면 AIP Core 문서를 확인한다.
- 서버가 권한과 실행을 최종 결정한다는 AIP의 전제를 우회하는 코드를 만들지 않는다. 호출자에게 여는 것은 \`expose\`로 선언한 것뿐이다.
- \`scripts/dev-token.mjs\`와 \`dev-idp/\`는 개발 전용이다. 운영 설정에 쓰거나 개인키를 커밋하지 않는다.
- 데이터베이스 연결 문자열을 파일에 쓰지 않는다. 설정은 환경 변수 이름(\`database_url_env\`)만 가리킨다.
- 이 프로젝트 전용이 아닌 데이터베이스에 연결하지 않는다.
`;
}

export function appAip(): string {
  return `// 이 파일 하나가 서버의 읽기·쓰기·권한 규칙이다. 서버 코드는 없다.
// 문법 정본: AIP Core의 spec/definition-syntax.md
resource Member { fields { id: Id } }
actor Member

resource Task {
  fields { id: Id; owner: Member; title: Text(1..200); done: Bool }
  rows read when owner = actor
  expose read {
    select id, owner, title, done
    filter id.eq, done.eq
    sort id
    budget { rows 50; depth 1; deadline 1s; cost 100 }
  }
  expose create {
    allow owner = actor and done = false
    fields owner, title, done
  }
  transition complete { allow owner = actor; from done = false; to done = true; repeat unchanged }
  expose apply complete { target id; bulk maxRows 20 }
}
`;
}

export function serviceJson(spec: ProjectSpec): string {
  const config = {
    schema: schemaName(spec.projectName),
    database_url_env: "AIP_DATABASE_URL",
    listen: "127.0.0.1:8080",
    wire: "decimal",
    auth: {
      issuer: "https://issuer.example",
      audience: "aip-api",
      jwks: { kind: "file", path: "./dev-idp/jwks.json" },
    },
  };
  return `${JSON.stringify(config, null, 2)}\n`;
}

export function packageJson(spec: ProjectSpec): string {
  const pkg = {
    name: spec.projectName,
    version: "0.0.0",
    private: true,
    type: "module",
    scripts: {
      check: "aip service check app.aip",
      gen: `aip service gen app.aip --wire decimal --out client/binding.ts --sdk-import ${AIP_SDK_PACKAGE}`,
      idp: "node scripts/dev-token.mjs --dir dev-idp --subject " + DEV_SUBJECT + " > /dev/null",
      "db:init": "aip service init app.aip --config service.json",
      "db:seed": `psql "$AIP_DATABASE_URL" -v ON_ERROR_STOP=1 -f db/seed.sql && aip service principal --config service.json bind --subject ${DEV_SUBJECT} --actor 1`,
      setup: "npm run idp && npm run gen && npm run db:init && npm run db:seed",
      start: "aip service serve app.aip --config service.json",
      demo: `AIP_TOKEN="$(node scripts/dev-token.mjs --dir dev-idp --subject ${DEV_SUBJECT})" node client/main.ts`,
    },
    dependencies: { [AIP_SDK_PACKAGE]: AIP_SDK_RANGE },
    engines: { node: ">=26" },
  };
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

export function seedSql(spec: ProjectSpec): string {
  return `-- 개발용 사용자(actor 행) 1명. 토큰의 subject와의 연결은 \`npm run db:seed\`가 \`aip service principal bind\`로 한다.
INSERT INTO ${schemaName(spec.projectName)}.member(id) VALUES (1) ON CONFLICT (id) DO NOTHING;
`;
}

export function clientMain(): string {
  return `import { connect } from "${AIP_SDK_PACKAGE}";
import { contract } from "./binding.ts";

// 개발용 토큰으로 호출한다. 운영에서는 외부 인증 제공자의 access token을 넣는다.
const client = connect(process.env.AIP_URL ?? "http://127.0.0.1:8080", process.env.AIP_TOKEN ?? null, contract);

const me = await client.session();
const created = await client.bundle(
  { atomic: [{ create: "Task", values: { owner: me.actorId, title: "첫 할 일", done: false } }] } as const,
  { key: \`create-\${Date.now()}\` },
);
if (!created.ok) throw new Error(JSON.stringify(created));
const id = created.created[0].id!;
const completed = await client.apply({ apply: "Task.complete", target: { ids: [id] } } as const, { key: \`complete-\${id}\` });
const tasks = await client.read({ read: "Task", select: ["id", "title", "done"] } as const);
console.log(JSON.stringify({ session: me, completed, tasks: tasks.rows }));
`;
}

export const GITIGNORE = `node_modules/
dist/
target/
.DS_Store
.env
.env.*
dev-idp/
client/binding.ts
`;
