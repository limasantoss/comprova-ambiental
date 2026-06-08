import { useEffect, useRef, useState } from "react";

function PreviaHash({ calculando, hashCalculado }) {
  const [copiado, setCopiado] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copiarHash() {
    if (!hashCalculado || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(hashCalculado);
    setCopiado(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopiado(false);
    }, 1800);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Hash da prova</p>
          <p className="mt-2 break-all text-sm text-slate-600">
            {calculando
              ? "Calculando hash localmente..."
              : hashCalculado || "Preencha todos os campos e selecione um PDF para gerar a prova."}
          </p>
        </div>

        <button
          type="button"
          onClick={copiarHash}
          disabled={!hashCalculado}
          className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copiado ? "Hash copiado" : "Copiar hash"}
        </button>
      </div>
    </div>
  );
}

export default PreviaHash;
