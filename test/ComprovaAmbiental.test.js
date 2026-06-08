const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ComprovaAmbiental", function () {
  async function deployComprovaAmbiental() {
    const [owner] = await ethers.getSigners();
    const ComprovaAmbiental = await ethers.getContractFactory("ComprovaAmbiental");
    const contrato = await ComprovaAmbiental.deploy();

    return { contrato, owner };
  }

  function dadosValidos() {
    return {
      hashProva: ethers.id("laudo-ambiental-pdf-car-lat-long"),
      tipoDocumento: "Laudo Ambiental",
      codigoCAR: "PA-1234567-89ABCDEF0123456789ABCDEF012345",
      latitude: "-1.4558",
      longitude: "-48.5039"
    };
  }

  it("registra uma prova ambiental valida", async function () {
    const { contrato, owner } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        prova.tipoDocumento,
        prova.codigoCAR,
        prova.latitude,
        prova.longitude
      )
    )
      .to.emit(contrato, "ProvaRegistrada")
      .withArgs(
        prova.hashProva,
        owner.address,
        prova.tipoDocumento,
        prova.codigoCAR,
        prova.latitude,
        prova.longitude,
        anyValue
      );
  });

  it("permite consultar se uma prova existe", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await contrato.registrarProva(
      prova.hashProva,
      prova.tipoDocumento,
      prova.codigoCAR,
      prova.latitude,
      prova.longitude
    );

    expect(await contrato.existeProva(prova.hashProva)).to.equal(true);
  });

  it("retorna os dados corretos do registro", async function () {
    const { contrato, owner } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await contrato.registrarProva(
      prova.hashProva,
      prova.tipoDocumento,
      prova.codigoCAR,
      prova.latitude,
      prova.longitude
    );

    const registro = await contrato.obterRegistro(prova.hashProva);

    expect(registro.registrador).to.equal(owner.address);
    expect(registro.tipoDocumento).to.equal(prova.tipoDocumento);
    expect(registro.codigoCAR).to.equal(prova.codigoCAR);
    expect(registro.latitude).to.equal(prova.latitude);
    expect(registro.longitude).to.equal(prova.longitude);
    expect(registro.dataRegistro).to.be.greaterThan(0n);
    expect(registro.existe).to.equal(true);
  });

  it("impede registrar hash bytes32(0)", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        ethers.ZeroHash,
        prova.tipoDocumento,
        prova.codigoCAR,
        prova.latitude,
        prova.longitude
      )
    ).to.be.revertedWith("Hash da prova invalido");
  });

  it("impede registrar tipoDocumento vazio", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        "",
        prova.codigoCAR,
        prova.latitude,
        prova.longitude
      )
    ).to.be.revertedWith("Tipo do documento obrigatorio");
  });

  it("impede registrar codigoCAR vazio", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        prova.tipoDocumento,
        "",
        prova.latitude,
        prova.longitude
      )
    ).to.be.revertedWith("Codigo CAR obrigatorio");
  });

  it("impede registrar latitude vazia", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        prova.tipoDocumento,
        prova.codigoCAR,
        "",
        prova.longitude
      )
    ).to.be.revertedWith("Latitude obrigatoria");
  });

  it("impede registrar longitude vazia", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        prova.tipoDocumento,
        prova.codigoCAR,
        prova.latitude,
        ""
      )
    ).to.be.revertedWith("Longitude obrigatoria");
  });

  it("impede registrar o mesmo hashProva duas vezes", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const prova = dadosValidos();

    await contrato.registrarProva(
      prova.hashProva,
      prova.tipoDocumento,
      prova.codigoCAR,
      prova.latitude,
      prova.longitude
    );

    await expect(
      contrato.registrarProva(
        prova.hashProva,
        prova.tipoDocumento,
        prova.codigoCAR,
        prova.latitude,
        prova.longitude
      )
    ).to.be.revertedWith("Prova ja registrada");
  });

  it("reverte ao tentar obter registro inexistente", async function () {
    const { contrato } = await deployComprovaAmbiental();
    const hashInexistente = ethers.id("registro-inexistente");

    await expect(contrato.obterRegistro(hashInexistente)).to.be.revertedWith(
      "Prova nao encontrada"
    );
  });
});
