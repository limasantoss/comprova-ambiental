import { BrowserProvider, Contract } from "ethers";
import abiComprovaAmbiental from "../abi/ComprovaAmbiental.json";
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from "../config";

function obterEthereum() {
  if (!window.ethereum) {
    throw new Error("METAMASK_NAO_ENCONTRADA");
  }

  return window.ethereum;
}

async function obterProvider() {
  const ethereum = obterEthereum();
  return new BrowserProvider(ethereum);
}

async function validarRede(provider) {
  const network = await provider.getNetwork();
  return Number(network.chainId) === SEPOLIA_CHAIN_ID;
}

function criarContrato(providerOuSigner) {
  return new Contract(CONTRACT_ADDRESS, abiComprovaAmbiental, providerOuSigner);
}

// Centraliza a regra de que registro e consulta devem acontecer na Sepolia.
async function obterProviderSepolia() {
  const provider = await obterProvider();
  const redeCorreta = await validarRede(provider);

  if (!redeCorreta) {
    throw new Error("REDE_INVALIDA");
  }

  return provider;
}

export async function conectarMetaMask() {
  const ethereum = obterEthereum();
  const contas = await ethereum.request({ method: "eth_requestAccounts" });
  const provider = await obterProvider();
  const redeCorreta = await validarRede(provider);

  return {
    endereco: contas[0] || "",
    redeCorreta
  };
}

export async function obterContaAtual() {
  if (!window.ethereum) {
    return {
      endereco: "",
      redeCorreta: true
    };
  }

  const ethereum = obterEthereum();
  const contas = await ethereum.request({ method: "eth_accounts" });
  const provider = await obterProvider();
  const redeCorreta = await validarRede(provider);

  return {
    endereco: contas[0] || "",
    redeCorreta
  };
}

// Envia apenas a prova final e metadados simples; o PDF original nunca sai do navegador.
export async function registrarProva({
  hashProva,
  tipoDocumento,
  codigoCAR,
  latitude,
  longitude
}) {
  if (
    !hashProva ||
    !tipoDocumento.trim() ||
    !codigoCAR.trim() ||
    !latitude.trim() ||
    !longitude.trim()
  ) {
    throw new Error("CAMPOS_OBRIGATORIOS");
  }

  const provider = await obterProviderSepolia();
  const signer = await provider.getSigner();
  const contrato = criarContrato(signer);
  const transacao = await contrato.registrarProva(
    hashProva,
    tipoDocumento.trim(),
    codigoCAR.trim(),
    latitude.trim(),
    longitude.trim()
  );

  await transacao.wait();

  return {
    hashTransacao: transacao.hash
  };
}

export async function existeProva(hashProva) {
  if (!hashProva) {
    throw new Error("HASH_NAO_INFORMADO");
  }

  const provider = await obterProviderSepolia();
  const contrato = criarContrato(provider);

  return contrato.existeProva(hashProva);
}

export async function obterRegistro(hashProva) {
  if (!hashProva) {
    throw new Error("HASH_NAO_INFORMADO");
  }

  const provider = await obterProviderSepolia();
  const contrato = criarContrato(provider);
  const registro = await contrato.obterRegistro(hashProva);

  return {
    registrador: registro.registrador,
    tipoDocumento: registro.tipoDocumento,
    codigoCAR: registro.codigoCAR,
    latitude: registro.latitude,
    longitude: registro.longitude,
    dataRegistro: Number(registro.dataRegistro),
    existe: registro.existe
  };
}
