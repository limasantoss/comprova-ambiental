function MensagemStatus({ status }) {
  if (!status) {
    return null;
  }

  const estilos = {
    sucesso: "border-emerald-200 bg-emerald-50 text-emerald-900",
    erro: "border-rose-200 bg-rose-50 text-rose-900",
    alerta: "border-amber-200 bg-amber-50 text-amber-900"
  };

  return (
    <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${estilos[status.tipo] || estilos.alerta}`}>
      <p className="font-medium">{status.texto}</p>
      {status.link ? (
        <a
          href={status.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex text-sm font-semibold underline underline-offset-4"
        >
          {status.textoLink || "Abrir link"}
        </a>
      ) : null}
    </div>
  );
}

export default MensagemStatus;
