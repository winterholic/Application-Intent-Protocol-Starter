import { useMemo, useState } from "react";
import { AIP_CORE_REPOSITORY, generate, InvalidProjectInput, OPTION_CATALOG } from "@makeaip/generator";
import { downloadZip } from "./download";

export function App() {
  const [projectName, setProjectName] = useState("my-aip-app");
  const [agentInstructions, setAgentInstructions] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const outcome = useMemo(() => {
    try {
      return { result: generate({ projectName, agentInstructions }) } as const;
    } catch (error) {
      if (error instanceof InvalidProjectInput) return { error: error.message } as const;
      throw error;
    }
  }, [projectName, agentInstructions]);

  const pending = OPTION_CATALOG.filter((o) => o.status === "pending-core");
  const files = "result" in outcome ? outcome.result.files : [];
  const preview = files.find((f) => f.path === selected) ?? files[0];

  return (
    <main className="layout">
      <header>
        <h1>MakeAIP</h1>
        <p className="lede">AIP 프로젝트를 시작하는 공식 방법.</p>
      </header>

      <section className="panel" aria-labelledby="options-title">
        <h2 id="options-title">Options</h2>
        <label className="field">
          <span>Project name</span>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} spellCheck={false} />
        </label>
        {"error" in outcome && <p className="error" role="alert">{outcome.error}</p>}
        <label className="check">
          <input type="checkbox" checked={agentInstructions} onChange={(e) => setAgentInstructions(e.target.checked)} />
          <span>AGENTS.md 생성</span>
        </label>

        <h3>AIP Core 확정 대기</h3>
        <ul className="pending">
          {pending.map((o) => (
            <li key={o.id}>
              <strong>{o.label}</strong>
              <span>{o.description}</span>
            </li>
          ))}
        </ul>

        <button type="button" disabled={!("result" in outcome)} onClick={() => "result" in outcome && downloadZip(outcome.result)}>
          Generate .zip
        </button>
      </section>

      <section className="panel" aria-labelledby="preview-title">
        <h2 id="preview-title">Preview</h2>
        <div className="preview">
          <ul className="tree">
            {files.map((f) => (
              <li key={f.path}>
                <button type="button" aria-pressed={f.path === preview?.path} onClick={() => setSelected(f.path)}>
                  {f.path}
                </button>
              </li>
            ))}
          </ul>
          <pre>{preview?.contents}</pre>
        </div>
      </section>

      <footer>
        AIP Specification: <a href={AIP_CORE_REPOSITORY}>{AIP_CORE_REPOSITORY.replace("https://", "")}</a>
      </footer>
    </main>
  );
}
