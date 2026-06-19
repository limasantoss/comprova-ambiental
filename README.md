nota final : 9.5 

# Comprova Ambiental

MVP do desafio ProofChain/HackWeb para registro e verificação pública da integridade de documentos ambientais em PDF usando blockchain.

## Visão geral

O Comprova Ambiental cria uma prova criptográfica verificável a partir de um documento ambiental em PDF e de metadados associados ao documento. Essa prova é registrada na rede Sepolia e pode ser consultada depois para verificar se o mesmo PDF e os mesmos dados correspondem ao registro original.

O foco do projeto é integridade documental. O sistema não tenta validar a verdade material do conteúdo ambiental, fundiário ou regulatório.

## Problema

Documentos ambientais circulam por e-mail, WhatsApp, sistemas internos e auditorias. Um PDF pode ser verdadeiro como arquivo, mas ainda assim estar ligado a dados inconsistentes, como Código CAR (Cadastro Ambiental Rural) trocado, coordenada alterada ou versão comprometida.

O arquivo sozinho não basta. O risco está na combinação entre documento e metadados.

## Solução

O sistema transforma o PDF, o tipo de documento, o Código CAR (Cadastro Ambiental Rural), a latitude e a longitude em um registro criptográfico verificável.

Fluxo resumido:

1. O PDF é lido localmente no navegador.
2. O frontend gera o hash do PDF.
3. O frontend gera uma prova criptográfica final a partir do PDF e dos metadados.
4. A prova é registrada na Sepolia.
5. Depois, o usuário pode verificar se o mesmo PDF e os mesmos dados correspondem ao registro original.

Se mudar o PDF, o tipo de documento, o Código CAR (Cadastro Ambiental Rural), a latitude ou a longitude, a prova gerada muda e a verificação não encontra o mesmo registro.

## O que o projeto comprova

O projeto comprova que:

- um determinado PDF foi combinado com um conjunto específico de metadados
- essa combinação gerou uma prova criptográfica única
- essa prova foi registrada publicamente em blockchain
- a mesma combinação pode ser verificada depois de forma reproduzível

Em outras palavras, o MVP comprova integridade documental entre arquivo e metadados informados.

## O que o projeto não comprova

O projeto não comprova:

- validade jurídica do Código CAR (Cadastro Ambiental Rural)
- existência de floresta ou ativo ambiental
- conformidade regulatória do documento
- autenticidade material do conteúdo do PDF
- validade de crédito de carbono
- substituição de auditoria ambiental

## Como funciona

### Geração da prova

O cálculo da prova segue esta lógica:

```text
hashPDF = SHA-256(conteúdo binário do PDF)
hashProva = SHA-256(hashPDF|tipoDocumento|codigoCAR|latitude|longitude)
```

Passo a passo:

1. O PDF é lido no navegador com `arquivoPdf.arrayBuffer()`.
2. É gerado `hashPDF = SHA-256(conteúdo binário do PDF)`.
3. É montada a string canônica `hashPDF|tipoDocumento|codigoCAR|latitude|longitude`.
4. É gerado `hashProva = SHA-256(textoCanonico)`.
5. O contrato recebe `hashProva` e os metadados textuais.

### Registro

O frontend conecta a MetaMask, valida se a rede é Sepolia, calcula a prova localmente e envia uma transação para o contrato `ComprovaAmbiental`.

### Verificação

O frontend recalcula a prova usando novamente o PDF e os metadados informados. Se o `hashProva` existir no contrato, o registro é encontrado e os dados on-chain são exibidos.

## Arquitetura do MVP

### Camada on-chain

- contrato `ComprovaAmbiental`
- registro imutável da prova
- consulta pública da existência e dos dados do registro

### Camada off-chain

- interface React
- conexão com MetaMask via `ethers`
- leitura local do PDF
- geração do hash no navegador

### Estrutura principal do repositório

- `contracts/`: contrato, interface e biblioteca Solidity
- `frontend/`: aplicação React/Vite
- `scripts/`: script de deploy
- `test/`: testes do contrato
- `docs/`: documentação complementar e arquivos de apoio
- `assets/`: materiais visuais do projeto

## O que fica on-chain e off-chain

### On-chain

Ficam registrados na Sepolia:

- `hashProva`
- `registrador`
- `tipoDocumento`
- `codigoCAR`
- `latitude`
- `longitude`
- `dataRegistro`
- evento `ProvaRegistrada`

### Off-chain

Ficam fora da blockchain:

- PDF original
- `hashPDF` intermediário
- frontend
- lógica local de hash

Essa separação preserva a privacidade do documento, evita armazenar arquivos na blockchain e reduz custo de registro.

## Contrato inteligente

- Nome: `ComprovaAmbiental`
- Caminho: `contracts/ComprovaAmbiental.sol`
- Solidity: `0.8.28`
- Endereço na Sepolia: `0x96f8D7B787F6D848d0CB1BdDcC29c0F68c1304c1`

Funções usadas pelo frontend:

- `registrarProva(bytes32,string,string,string,string)`
- `existeProva(bytes32)`
- `obterRegistro(bytes32)`

Comportamento principal:

- `registrarProva(bytes32,string,string,string,string)`: grava a prova e os metadados on-chain
- `existeProva(bytes32)`: informa se um `hashProva` já foi registrado
- `obterRegistro(bytes32)`: retorna os dados completos do registro encontrado

## Tecnologias utilizadas

- Solidity `0.8.28`
- Hardhat
- Sepolia
- React 18
- Vite
- Tailwind CSS
- `ethers` v6
- Web Crypto API `SHA-256`

## Links do projeto

- Aplicação: https://comprova-ambiental.vercel.app
- GitHub: https://github.com/limasantoss/comprova-ambiental
- Vídeo-pitch: https://youtu.be/EBzX8tCgW7I
- Slides: `docs/comprova-ambiental-slides.pdf`
- Contrato Sepolia: `0x96f8D7B787F6D848d0CB1BdDcC29c0F68c1304c1`
- Etherscan: https://sepolia.etherscan.io/address/0x96f8D7B787F6D848d0CB1BdDcC29c0F68c1304c1
- Configuração do contrato no frontend: `frontend/src/config.js`

## Como executar localmente

### Pré-requisitos

- Node.js
- npm
- MetaMask no navegador

### Instalação de dependências

Na raiz do projeto:

```bash
npm install
```

No frontend:

```bash
cd frontend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
```

Esses valores são necessários para deploy na Sepolia. Não exponha chaves privadas reais no repositório.

### Compilar contratos

```bash
npm run compile
```

### Rodar o frontend

```bash
cd frontend
npm run dev
```

### Gerar build do frontend

```bash
cd frontend
npm run build
```

### Visualizar build localmente

```bash
cd frontend
npm run preview
```

## Como rodar testes

- Arquivo de testes: `test/ComprovaAmbiental.test.js`
- Quantidade atual: `10` testes
- Comando:

```bash
npm test
```

Cobertura principal:

- registro válido
- consulta de existência
- recuperação dos dados
- rejeição de hash zerado
- rejeição de campos vazios
- bloqueio de duplicidade
- erro para registro inexistente

## Como fazer deploy na Sepolia

Com a `.env` configurada:

```bash
npm run deploy:sepolia
```

Informações relacionadas:

- script de deploy: `scripts/deploy.js`
- endereço atualmente configurado no frontend: `0x96f8D7B787F6D848d0CB1BdDcC29c0F68c1304c1`

Caso um novo deploy seja feito, o endereço do contrato deve ser atualizado em `frontend/src/config.js`.

## Fluxo de demonstração

Sugestão de roteiro objetivo:

1. Abrir a aplicação.
2. Conectar a MetaMask.
3. Confirmar que a rede ativa é Sepolia.
4. Escolher o modo `Registrar prova`.
5. Selecionar o tipo de documento.
6. Informar Código CAR (Cadastro Ambiental Rural), latitude e longitude.
7. Fazer upload do PDF.
8. Mostrar a geração local do hash.
9. Confirmar a transação na MetaMask.
10. Mostrar a mensagem de sucesso e o link do Etherscan.
11. Trocar para `Verificar prova`.
12. Reenviar o mesmo PDF e os mesmos dados.
13. Mostrar que a prova é encontrada.
14. Alterar um caractere do Código CAR (Cadastro Ambiental Rural) ou uma coordenada.
15. Repetir a verificação e mostrar que o registro não é encontrado.

## Arquivos fictícios para teste

A pasta `docs/amostras/` contém laudos ambientais fictícios criados apenas para testar o fluxo do MVP Comprova Ambiental.

Esses documentos não possuem validade técnica, jurídica, ambiental ou regulatória. Eles servem somente para demonstrar o registro e a verificação de integridade entre um documento ambiental em PDF e os metadados informados no sistema.

Arquivos disponíveis:

- `docs/amostras/laudo_06_ambiental_chacara_ipe_amarelo.pdf`
- `docs/amostras/laudo_07_ambiental_fazenda_lagoa_do_cedro.pdf`
- `docs/amostras/laudo_08_ambiental_sitio_serra_das_araras.pdf`

## Limitações

Este MVP:

- não valida juridicamente o Código CAR (Cadastro Ambiental Rural)
- não prova existência de floresta
- não substitui auditoria
- não valida crédito de carbono
- não analisa semanticamente o PDF
- não guarda PDF
- não tem backend
- não é produto final de mercado

Além disso:

- a verificação atual no frontend depende da MetaMask no navegador
- o sistema verifica integridade documental, não veracidade ambiental
- qualquer alteração textual relevante em metadados gera uma nova prova

## Alinhamento com o desafio ProofChain

O projeto atende aos elementos centrais do desafio:

- contrato deployado em testnet pública
- registro on-chain
- consulta e verificação pública da prova
- integração frontend-blockchain
- uso de hash para representar integridade
- registros imutáveis em blockchain
- problema real de integridade documental
- justificativa clara para uso de blockchain

Itens complementares:

- repositório funcional
- README de execução
- vídeo-pitch publicado no YouTube como não listado
- slides em PDF disponíveis em `docs/comprova-ambiental-slides.pdf`

## Uso de IA generativa

Foram utilizadas as ferramentas ChatGPT, Gemini e Codex como apoio em planejamento, revisão técnica, documentação, roteiro, debugging e organização do projeto.

Todo uso foi feito com supervisão humana, e a validação final das decisões, do funcionamento do MVP e do conteúdo entregue permaneceu sob responsabilidade do autor.

## Referências de contexto

Este projeto foi motivado por uma dor real: documentos e dados ambientais podem circular entre diferentes partes, sistemas e auditorias, aumentando o risco de inconsistências, alterações ou dificuldade de verificação.

Referências públicas que contextualizam esse tipo de problema:

- Polícia Federal — Operação Castelo de Fogo contra grilagem, desmatamento ilegal e fraudes no Cadastro Ambiental Rural: https://www.gov.br/pf/pt-br/assuntos/noticias/2025/11/pf-deflagra-operacao-castelo-de-fogo-contra-grilagem-e-desmatamento-no-oeste-do-para
- HNT — notícia sobre ação relacionada a fraudes em CAR (Cadastro Ambiental Rural) remetida ao TJMT: https://www.hnt.com.br/justica/justica-remete-acao-sobre-fraudes-em-car-ao-tjmt-por-foro-de-ex-secretario-da-sema/519756

Essas referências são usadas apenas como contexto do problema. O Comprova Ambiental não investiga fraudes, não valida juridicamente o Código CAR (Cadastro Ambiental Rural) e não substitui auditoria ambiental.

## Autor

- Igor Lima
- Projeto desenvolvido individualmente para o HackWeb / ProofChain — RESTIC 29.
