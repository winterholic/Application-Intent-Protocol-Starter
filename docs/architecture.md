# Architecture

## 생성 로직과 UI를 분리한다

```
            @makeaip/generator   (options → GenerationResult)
                     ↑
     ┌───────────────┼────────────────┐
MakeAIP Web        CLI        다른 도구 · AI Coding Agent (예정)
```

- **generator**는 `generate(input) → { spec, files[] }`만 제공한다. 파일 시스템, 네트워크, DOM, 시간에 의존하지 않는다.
  같은 입력이면 같은 결과가 나와야 하며 테스트가 이를 고정한다.
- **어댑터**(Web, CLI)는 입력을 모으고 결과를 내보내는 일만 한다. Web은 zip으로, CLI는 빈 디렉터리에 쓴다.
  어댑터에 템플릿이나 옵션 규칙을 두지 않는다.
- 선택 항목은 `OPTION_CATALOG` 데이터 하나가 정본이다. Web 폼과 `makeaip options` 출력이 모두 여기서 파생된다.

## 왜 브라우저에서 생성하나

생성 결과가 순수 함수의 출력이라 서버가 필요 없다. 정적 호스팅만으로 배포할 수 있고,
나중에 서버 측 생성(예: `curl`로 받는 API)이 필요해도 같은 generator를 서버 어댑터로 감싸면 된다.

## 아직 정하지 않은 것

- 템플릿을 코드로 둘지, 별도 템플릿 파일·원격 카탈로그로 뺄지. 템플릿 수가 늘어날 때 판단한다.
- 생성 프로젝트가 AIP Core의 도구(`aip` CLI, `@aip/sdk` 등)를 어떤 방식으로 받을지. AIP Core 배포 방식이 정해진 뒤 결정한다.
- CLI 배포 이름과 npm 공개 여부.
