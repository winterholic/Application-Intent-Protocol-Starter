/** 사용자가 고른 값. 키는 OPTION_CATALOG의 `id`와 같다. */
export interface ProjectInput {
  readonly projectName: string;
  readonly agentInstructions?: boolean;
}

/** 검증과 기본값 적용을 마친 값. 템플릿은 이것만 받는다. */
export interface ProjectSpec {
  readonly projectName: string;
  readonly agentInstructions: boolean;
}

export interface GeneratedFile {
  /** 프로젝트 루트 기준 POSIX 상대 경로. */
  readonly path: string;
  readonly contents: string;
}

export interface GenerationResult {
  readonly spec: ProjectSpec;
  /** 경로순 정렬. 같은 입력이면 항상 같은 결과를 낸다. */
  readonly files: readonly GeneratedFile[];
}
