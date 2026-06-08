function UploadPDF({ arquivo, onArquivoSelecionado }) {
  function handleChange(evento) {
    const proximoArquivo = evento.target.files?.[0] || null;
    onArquivoSelecionado(proximoArquivo);
  }

  return (
    <div>
      <p className="mb-2.5 text-base font-semibold text-[#101828]">Upload do PDF</p>

      <label className="flex h-[110px] w-full cursor-pointer items-center rounded-xl border-2 border-dashed border-[#D9E1D8] px-7 transition hover:border-[#1F8E36]">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#101828]">
            {arquivo ? arquivo.name : "Clique para selecionar o arquivo PDF"}
          </p>
          <p className="mt-1 text-sm text-[#667085]">OBS: Max. 10MB</p>
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default UploadPDF;
