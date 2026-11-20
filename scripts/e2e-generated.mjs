// 생성 직후 프로젝트가 실제로 동작하는지 끝까지 확인한다: 생성 → check → setup → serve → SDK 호출.
//
//   pnpm build
//   AIP_BIN=/path/to/aip \
//   AIP_SDK_TARBALL=/path/to/aip-sdk-1.0.0.tgz \
//   AIP_E2E_DATABASE_URL=postgres://user@127.0.0.1:5432/disposable_db \
//   [CORE_DIR=/path/to/Application-Intent-Protocol] \
//   node scripts/e2e-generated.mjs
//
// AIP_E2E_DATABASE_URL은 이 검사 전용으로 버려도 되는 데이터베이스여야 한다. 실행마다 새 schema(aip_e2e_<난수>)를 만들고
// 지우지 않는다. 기존 데이터가 있는 데이터베이스를 가리키지 않는다. npm 패키지가 publish되기 전이라 SDK는 tarball로 설치한다.
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const need = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요하다 (파일 머리말 참고)`);
  return value;
};
const aipBin = resolve(need("AIP_BIN"));
const sdkTarball = resolve(need("AIP_SDK_TARBALL"));
const databaseUrl = need("AIP_E2E_DATABASE_URL");
const port = process.env.AIP_E2E_PORT ?? "18080";
assert.equal(basename(aipBin), "aip", "AIP_BIN의 파일 이름은 aip여야 한다(npm 스크립트가 PATH에서 찾는다)");

const env = {
  ...process.env,
  PATH: `${dirname(aipBin)}:${process.env.PATH}`,
  AIP_DATABASE_URL: databaseUrl,
  AIP_URL: `http://127.0.0.1:${port}`,
};
// PG* 변수는 일부 도구가 다른 서버로 접속하게 만든다. 이 검사는 명시한 연결 문자열만 쓴다.
for (const name of ["PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE", "PGSERVICE"]) delete env[name];

let step = 0;
function sh(command, args, cwd, label) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
  const output = `${result.stdout}${result.stderr}`.trim().split("\n").filter(Boolean);
  console.log(`[${String(++step).padStart(2, "0")}] ${label}`);
  console.log(`     $ ${[command, ...args].join(" ")}  (exit ${result.status})`);
  for (const line of output.slice(-2)) console.log(`     ${line.slice(0, 200)}`);
  assert.equal(result.status, 0, `${label} 실패`);
  return result.stdout;
}

const name = `e2e-${randomBytes(4).toString("hex")}`;
const root = await mkdtemp(join(tmpdir(), "makeaip-e2e-"));
const project = join(root, name);
console.log(`임시 디렉터리: ${root}`);

sh("node", [join(here, "../packages/cli/dist/index.js"), "new", name, "--out", project], root, "빈 디렉터리에 generator 실행");

if (process.env.CORE_DIR) {
  const core = await readFile(join(process.env.CORE_DIR, "product/tools/dev-jwt.mjs"), "utf8");
  assert.equal(await readFile(join(project, "scripts/dev-token.mjs"), "utf8"), core, "scripts/dev-token.mjs가 Core dev-jwt.mjs와 다르다");
  console.log(`[--] scripts/dev-token.mjs가 Core dev-jwt.mjs와 같다`);
}

// 같은 호스트의 다른 서비스와 겹치지 않게 포트만 바꾼다.
const configPath = join(project, "service.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
config.listen = `127.0.0.1:${port}`;
await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);

sh("npm", ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", "--no-save", sdkTarball], project, "SDK tarball 설치");
const checked = JSON.parse(sh("npm", ["run", "--silent", "check"], project, "npm run check"));
assert.equal(checked.ok, true);
sh("npm", ["run", "--silent", "setup"], project, "npm run setup (키, binding, schema, 사용자 연결)");

const server = spawn("npm", ["start", "--silent"], { cwd: project, env, stdio: ["ignore", "pipe", "pipe"], detached: true });
let serverLog = "";
server.stdout.on("data", (chunk) => (serverLog += chunk));
server.stderr.on("data", (chunk) => (serverLog += chunk));
try {
  let ready = false;
  for (let attempt = 0; attempt < 50 && !ready; attempt++) {
    try {
      ready = (await fetch(`${env.AIP_URL}/ready`)).status === 200;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  assert.ok(ready, `서버가 ready가 되지 않았다:\n${serverLog}`);
  console.log(`[${String(++step).padStart(2, "0")}] npm start → ${env.AIP_URL}/ready 200`);

  const first = JSON.parse(sh("npm", ["run", "--silent", "demo"], project, "npm run demo (SDK 호출)").trim().split("\n").at(-1));
  assert.deepEqual(first.session, { actorId: "1" });
  assert.equal(first.completed.ok, true);
  assert.equal(first.tasks.length, 1);
  assert.equal(first.tasks[0].done, true);
  const second = JSON.parse(sh("npm", ["run", "--silent", "demo"], project, "npm run demo 한 번 더").trim().split("\n").at(-1));
  assert.equal(second.tasks.length, 2);

  // 권한 음성 대조: 토큰 없는 호출자는 본인 소유 행 정책 때문에 아무 행도 받지 못한다.
  const anonymous = JSON.parse(
    sh(
      "node",
      [
        "--input-type=module",
        "-e",
        'import { connect } from "@aip/sdk"; import { contract } from "./client/binding.ts"; const c = connect(process.env.AIP_URL, null, contract); console.log(JSON.stringify(await c.read({ read: "Task", select: ["id"] })))',
      ],
      project,
      "토큰 없는 SDK 읽기",
    )
      .trim()
      .split("\n")
      .at(-1),
  );
  assert.deepEqual(anonymous.rows, []);
} finally {
  // npm이 띄운 aip까지 같이 끝내려고 프로세스 그룹에 보낸다.
  process.kill(-server.pid, "SIGTERM");
}
console.log("ALL PASS");
