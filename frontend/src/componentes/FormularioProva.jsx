import { useState } from "react";
import UploadPDF from "./UploadPDF";
import { gerarHashProva } from "../utils/hash";

const camposIniciais = {
  tipoDocumento: "",
  codigoCAR: "",
  latitude: "",
  longitude: ""
};

function FormularioProva({
  onSubmit,
  carregando,
  textoBotao = "Registrar prova",
  onHashCalculado,
  onCalculandoHashChange
}) {
  const [campos, setCampos] = useState(camposIniciais);
  const [arquivoPdf, setArquivoPdf] = useState(null);

  function handleCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const possuiCamposObrigatorios = Boolean(
      arquivoPdf &&
        campos.tipoDocumento.trim() &&
        campos.codigoCAR.trim() &&
        campos.latitude.trim() &&
        campos.longitude.trim()
    );

    onHashCalculado?.("");
    onCalculandoHashChange?.(true);

    try {
      const resultadoHash = possuiCamposObrigatorios
        ? await gerarHashProva({ ...campos, arquivoPdf })
        : null;

      onHashCalculado?.(resultadoHash?.hashProva || "");

      await onSubmit({
        ...campos,
        arquivoPdf,
        hashProva: resultadoHash?.hashProva || ""
      });
    } finally {
      onCalculandoHashChange?.(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-[22px]">
        <label className="block">
          <span className="mb-2.5 block text-base font-semibold text-[#101828]">
            Tipo de documento
          </span>
          <select
            name="tipoDocumento"
            value={campos.tipoDocumento}
            onChange={handleCampo}
            required
            className="h-16 w-full rounded-xl border border-[#D9E1D8] bg-white px-4 text-base text-[#101828] outline-none transition focus:border-[#1F8E36] focus:ring-2 focus:ring-[#1F8E36]/20"
          >
            <option value="" disabled>
              Selecione o tipo de documento
            </option>
            <option value="Laudo ambiental">Laudo ambiental</option>
            <option value="Relatório de vistoria ambiental">Relatório de vistoria ambiental</option>
            <option value="Relatório de auditoria ambiental">Relatório de auditoria ambiental</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2.5 block text-base font-semibold text-[#101828]">
            Código CAR
          </span>
          <input
            name="codigoCAR"
            value={campos.codigoCAR}
            onChange={handleCampo}
            placeholder="Ex: CE-2304400-123456789ABCDEF"
            className="h-16 w-full rounded-xl border border-[#D9E1D8] bg-white px-4 text-base text-[#101828] placeholder:text-[#667085] outline-none transition focus:border-[#1F8E36] focus:ring-2 focus:ring-[#1F8E36]/20"
          />
        </label>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <label className="block">
            <span className="mb-2.5 block text-base font-semibold text-[#101828]">
              Latitude da área analisada
            </span>
            <input
              name="latitude"
              value={campos.latitude}
              onChange={handleCampo}
              placeholder="Ex: -3.760200"
              className="h-16 w-full rounded-xl border border-[#D9E1D8] bg-white px-4 text-base text-[#101828] placeholder:text-[#667085] outline-none transition focus:border-[#1F8E36] focus:ring-2 focus:ring-[#1F8E36]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2.5 block text-base font-semibold text-[#101828]">
              Longitude da área analisada
            </span>
            <input
              name="longitude"
              value={campos.longitude}
              onChange={handleCampo}
              placeholder="Ex: -38.478200"
              className="h-16 w-full rounded-xl border border-[#D9E1D8] bg-white px-4 text-base text-[#101828] placeholder:text-[#667085] outline-none transition focus:border-[#1F8E36] focus:ring-2 focus:ring-[#1F8E36]/20"
            />
          </label>
        </div>

        <UploadPDF arquivo={arquivoPdf} onArquivoSelecionado={setArquivoPdf} />
      </div>

      <button
        type="submit"
        disabled={carregando}
        className="mt-[34px] inline-flex h-20 w-full items-center justify-center rounded-[18px] bg-[#1F8E36] text-lg font-bold text-white transition hover:bg-[#166B2A] disabled:cursor-not-allowed disabled:bg-[#4FA864]"
      >
        {carregando ? "Processando..." : textoBotao}
      </button>
    </form>
  );
}

export default FormularioProva;
