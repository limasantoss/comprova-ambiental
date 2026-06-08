export function encurtarEndereco(endereco, tamanhoInicio = 6) {
  if (!endereco) {
    return "";
  }

  return `${endereco.slice(0, tamanhoInicio)}...${endereco.slice(-4)}`;
}

export function formatarDataUnix(timestamp) {
  if (!timestamp) {
    return "-";
  }

  return new Date(Number(timestamp) * 1000).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

// Traduz erros técnicos de wallet, rede e contrato em mensagens curtas para o usuário.
export function obterMensagemAmigavel(error) {
  const mensagemBruta = `${error?.shortMessage || ""} ${error?.reason || ""} ${error?.message || ""}`.toLowerCase();

  if (error?.message === "METAMASK_NAO_ENCONTRADA") {
    return "MetaMask nao encontrada neste navegador.";
  }

  if (error?.message === "REDE_INVALIDA") {
    return "Troque para a rede Sepolia na MetaMask.";
  }

  if (error?.message === "CAMPOS_OBRIGATORIOS") {
    return "Preencha todos os campos e selecione o PDF.";
  }

  if (error?.message === "HASH_NAO_INFORMADO" || error?.message === "PDF_NAO_INFORMADO") {
    return "Preencha todos os campos e selecione o PDF.";
  }

  if (mensagemBruta.includes("user rejected") || mensagemBruta.includes("action rejected")) {
    return "Transação cancelada.";
  }

  if (mensagemBruta.includes("prova ja registrada")) {
    return "Essa prova ja foi registrada.";
  }

  if (mensagemBruta.includes("prova nao encontrada")) {
    return "Prova nao encontrada para esses dados.";
  }

  if (mensagemBruta.includes("missing revert data")) {
    return "Nao foi possivel concluir a operacao. Confira os dados e tente novamente.";
  }

  return "Nao foi possivel concluir a operacao. Confira a MetaMask e tente novamente.";
}
