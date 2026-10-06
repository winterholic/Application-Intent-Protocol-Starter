import { strToU8, zipSync } from "fflate";
import type { GenerationResult } from "@makeaip/generator";

/** 모든 파일을 `<projectName>/` 아래에 담은 zip을 브라우저에서 내려받게 한다. */
export function downloadZip(result: GenerationResult): void {
  const root = result.spec.projectName;
  const entries = Object.fromEntries(result.files.map((f) => [`${root}/${f.path}`, strToU8(f.contents)]));
  const blob = new Blob([zipSync(entries)], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${root}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
