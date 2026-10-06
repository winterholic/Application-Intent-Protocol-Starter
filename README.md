# MakeAIP

AIP(Application Intent Protocol) 프로젝트를 시작하는 공식 Project Generator.
필요한 옵션을 고르면 바로 시작할 수 있는 AIP 프로젝트의 초기 구조를 만든다.

> 저장소 이름은 `Application-Intent-Protocol-Starter`지만 제품명은 **MakeAIP**이다.

## 상태

초기 세팅 단계다. AIP Core/Specification이 아직 설계 중이라 생성 가능한 선택 항목은
`Project name`과 `Agent instructions`뿐이다. Language·Runtime·Frontend·Database·Authentication은
AIP Core에서 확정되기 전까지 "확정 대기"로만 표시한다. 자세한 기준은 [docs/upstream.md](docs/upstream.md).

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

## License

MIT
