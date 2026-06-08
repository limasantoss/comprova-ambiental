const hre = require("hardhat");

async function main() {
  const ComprovaAmbiental = await hre.ethers.getContractFactory("ComprovaAmbiental");
  const contrato = await ComprovaAmbiental.deploy();

  await contrato.waitForDeployment();

  console.log("Contrato ComprovaAmbiental deployado com sucesso.");
  console.log("Endereco do contrato:", await contrato.getAddress());
  console.log("Rede usada:", hre.network.name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
