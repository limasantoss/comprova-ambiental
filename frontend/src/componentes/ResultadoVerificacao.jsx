import { encurtarEndereco, formatarDataUnix } from "../utils/formatacao";

function ResultadoVerificacao({ resultado }) {
  if (!resultado) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/55 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-emerald-950">Documento registrado</h3>
        <p className="mt-1 text-sm text-slate-600">
          A prova foi localizada na Sepolia com os metadados informados.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Registrador
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{encurtarEndereco(resultado.registrador, 10)}</dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Tipo de documento
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{resultado.tipoDocumento}</dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Código CAR
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{resultado.codigoCAR}</dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Data do registro
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{formatarDataUnix(resultado.dataRegistro)}</dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Latitude da área analisada
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{resultado.latitude}</dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Longitude da área analisada
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{resultado.longitude}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ResultadoVerificacao;
