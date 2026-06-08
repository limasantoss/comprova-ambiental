function arrayBufferParaHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

async function gerarSha256(conteudo) {
  const digest = await crypto.subtle.digest("SHA-256", conteudo);
  return arrayBufferParaHex(digest);
}

async function gerarHashPdf(arquivoPdf) {
  // O PDF é lido apenas no navegador; o arquivo bruto não vai para servidor nem para a blockchain.
  const conteudo = await arquivoPdf.arrayBuffer();
  return gerarSha256(conteudo);
}

export async function gerarHashProva({
  arquivoPdf,
  tipoDocumento,
  codigoCAR,
  latitude,
  longitude
}) {
  if (!arquivoPdf) {
    throw new Error("PDF_NAO_INFORMADO");
  }

  const hashPDF = await gerarHashPdf(arquivoPdf);
  // Registro e verificação precisam montar exatamente esta mesma string para chegar ao mesmo hash final.
  const textoCanonico = [
    hashPDF,
    tipoDocumento.trim(),
    codigoCAR.trim(),
    latitude.trim(),
    longitude.trim()
  ].join("|");

  const textoBytes = new TextEncoder().encode(textoCanonico);
  const hashProva = await gerarSha256(textoBytes);

  return {
    hashPDF,
    textoCanonico,
    hashProva
  };
}
