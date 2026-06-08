import { encurtarEndereco } from "../utils/formatacao";

function Cabecalho({ carteira, conectando, onConectar, redeCorreta }) {
  const textoBotao = carteira
    ? encurtarEndereco(carteira)
    : conectando
      ? "Conectando..."
      : "Conectar MetaMask";

  return (
    <header className="border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex min-h-28 w-full max-w-[1400px] flex-col justify-center gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-center">
          <p className="text-lg font-bold text-[#114B2B]">Comprova Ambiental</p>
        </div>

        <div className="flex flex-col items-start gap-2 lg:items-end">
          <button
            type="button"
            onClick={onConectar}
            disabled={conectando}
            className="inline-flex h-[58px] w-full items-center justify-center rounded-[14px] bg-[#1F8E36] px-6 text-sm font-bold text-white transition hover:bg-[#166B2A] disabled:cursor-not-allowed disabled:bg-[#4FA864] sm:w-[262px]"
          >
            {textoBotao}
          </button>

          {carteira && !redeCorreta ? (
            <p className="text-xs font-medium text-amber-700">
              Troque para a rede Sepolia na MetaMask.
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Cabecalho;
