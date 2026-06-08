import { useEffect, useState } from "react";
import Cabecalho from "./componentes/Cabecalho";
import FormularioProva from "./componentes/FormularioProva";
import MensagemStatus from "./componentes/MensagemStatus";
import PreviaHash from "./componentes/PreviaHash";
import ResultadoVerificacao from "./componentes/ResultadoVerificacao";
import {
  conectarMetaMask,
  existeProva,
  obterContaAtual,
  obterRegistro,
  registrarProva
} from "./servicos/blockchain";
import { obterMensagemAmigavel } from "./utils/formatacao";
import { SEPOLIA_ETHERSCAN_BASE_URL } from "./config";

function App() {
  const [modo, setModo] = useState("registrar");
  const [carteira, setCarteira] = useState("");
  const [redeCorreta, setRedeCorreta] = useState(true);
  const [conectando, setConectando] = useState(false);
  const [carregandoAcao, setCarregandoAcao] = useState(false);
  const [status, setStatus] = useState(null);
  const [resultadoVerificacao, setResultadoVerificacao] = useState(null);
  const [hashCalculado, setHashCalculado] = useState("");
  const [calculandoHash, setCalculandoHash] = useState(false);

  // Mantém a interface sincronizada se a conta ou a rede mudarem na MetaMask.
  useEffect(() => {
    async function carregarConta() {
      try {
        const contaAtual = await obterContaAtual();
        setCarteira(contaAtual.endereco);
        setRedeCorreta(contaAtual.redeCorreta);
      } catch {
        setCarteira("");
        setRedeCorreta(true);
      }
    }

    carregarConta();

    if (!window.ethereum) {
      return undefined;
    }

    const lidarMudanca = () => {
      carregarConta();
    };

    window.ethereum.on("accountsChanged", lidarMudanca);
    window.ethereum.on("chainChanged", lidarMudanca);

    return () => {
      if (!window.ethereum?.removeListener) {
        return;
      }

      window.ethereum.removeListener("accountsChanged", lidarMudanca);
      window.ethereum.removeListener("chainChanged", lidarMudanca);
    };
  }, []);

  async function handleConectar() {
    setConectando(true);
    setStatus(null);

    try {
      const conexao = await conectarMetaMask();
      setCarteira(conexao.endereco);
      setRedeCorreta(conexao.redeCorreta);

      if (!conexao.redeCorreta) {
        setStatus({
          tipo: "alerta",
          texto: "Troque para a rede Sepolia na MetaMask."
        });
        return;
      }

      setStatus({
        tipo: "sucesso",
        texto: "MetaMask conectada com sucesso."
      });
    } catch (error) {
      setStatus({
        tipo: "erro",
        texto: obterMensagemAmigavel(error)
      });
    } finally {
      setConectando(false);
    }
  }

  function handleTrocarModo(proximoModo) {
    setModo(proximoModo);
    setStatus(null);
    setResultadoVerificacao(null);
    setHashCalculado("");
    setCalculandoHash(false);
  }

  async function handleRegistrar(dadosFormulario) {
    setCarregandoAcao(true);
    setStatus(null);
    setResultadoVerificacao(null);

    if (!carteira) {
      setStatus({
        tipo: "alerta",
        texto: "Conecte a MetaMask antes de registrar."
      });
      setCarregandoAcao(false);
      return;
    }

    if (!redeCorreta) {
      setStatus({
        tipo: "alerta",
        texto: "Troque para a rede Sepolia na MetaMask."
      });
      setCarregandoAcao(false);
      return;
    }

    try {
      const resposta = await registrarProva(dadosFormulario);

      setStatus({
        tipo: "sucesso",
        texto: "Prova registrada com sucesso na Sepolia.",
        link: `${SEPOLIA_ETHERSCAN_BASE_URL}/tx/${resposta.hashTransacao}`,
        textoLink: "Ver transação no Etherscan"
      });
    } catch (error) {
      setStatus({
        tipo: "erro",
        texto: obterMensagemAmigavel(error)
      });
    } finally {
      setCarregandoAcao(false);
    }
  }

  async function handleVerificar(dadosFormulario) {
    setCarregandoAcao(true);
    setStatus(null);
    setResultadoVerificacao(null);

    try {
      const provaExiste = await existeProva(dadosFormulario.hashProva);

      if (!provaExiste) {
        setStatus({
          tipo: "alerta",
          texto: "Prova não encontrada para esses dados."
        });
        return;
      }

      const registro = await obterRegistro(dadosFormulario.hashProva);

      setResultadoVerificacao(registro);
      setStatus({
        tipo: "sucesso",
        texto: "Prova encontrada. Este documento corresponde ao registro."
      });
    } catch (error) {
      setStatus({
        tipo: "erro",
        texto: obterMensagemAmigavel(error)
      });
    } finally {
      setCarregandoAcao(false);
    }
  }

  const tituloPagina =
    modo === "registrar" ? "Registrar documento ambiental" : "Verificar documento ambiental";

  const descricaoPagina =
    modo === "registrar"
      ? "Preencha os dados do documento e da área analisada para gerar a prova de integridade."
      : "Envie o mesmo PDF e os mesmos metadados para verificar se a prova já foi registrada.";

  const textoBotao = modo === "registrar" ? "Registrar prova" : "Verificar prova";

  return (
    <div className="min-h-screen bg-white text-[#101828]">
      <Cabecalho
        carteira={carteira}
        conectando={conectando}
        onConectar={handleConectar}
        redeCorreta={redeCorreta}
      />

      <main className="flex min-h-[calc(100vh-112px)] justify-center px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <section className="w-full max-w-[764px] rounded-[28px] border border-[#EAEAEA] bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.08)] sm:p-[42px]">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleTrocarModo("registrar")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                modo === "registrar"
                  ? "border-[#1F8E36] bg-[#1F8E36] text-white"
                  : "border-[#D9E1D8] bg-white text-[#1F8E36]"
              }`}
            >
              Registrar prova
            </button>
            <button
              type="button"
              onClick={() => handleTrocarModo("verificar")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                modo === "verificar"
                  ? "border-[#1F8E36] bg-[#1F8E36] text-white"
                  : "border-[#D9E1D8] bg-white text-[#1F8E36]"
              }`}
            >
              Verificar prova
            </button>
          </div>

          <h1 className="mt-7 text-[32px] font-bold text-[#114B2B]">{tituloPagina}</h1>
          <p className="mt-3.5 text-sm text-[#667085]">{descricaoPagina}</p>

          <div className="mt-[34px]">
            <MensagemStatus status={status} />
            <FormularioProva
              carregando={carregandoAcao}
              onSubmit={modo === "registrar" ? handleRegistrar : handleVerificar}
              textoBotao={textoBotao}
              onHashCalculado={setHashCalculado}
              onCalculandoHashChange={setCalculandoHash}
            />
            <div className="mt-6">
              <PreviaHash calculando={calculandoHash} hashCalculado={hashCalculado} />
            </div>
            <ResultadoVerificacao resultado={resultadoVerificacao} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
