// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IComprovaAmbiental.sol";
import "./libraries/ValidadorTexto.sol";

contract ComprovaAmbiental is IComprovaAmbiental {
    using ValidadorTexto for string;

    // O hash final da prova funciona como identificador único do registro on-chain.
    mapping(bytes32 => Registro) private registros;

    function registrarProva(
        bytes32 hashProva,
        string calldata tipoDocumento,
        string calldata codigoCAR,
        string calldata latitude,
        string calldata longitude
    ) external override {
        require(hashProva != bytes32(0), "Hash da prova invalido");
        tipoDocumento.validarObrigatorio("Tipo do documento obrigatorio");
        codigoCAR.validarObrigatorio("Codigo CAR obrigatorio");
        latitude.validarObrigatorio("Latitude obrigatoria");
        longitude.validarObrigatorio("Longitude obrigatoria");
        // Impede duplicidade quando o mesmo PDF e os mesmos metadados geram a mesma prova.
        require(!registros[hashProva].existe, "Prova ja registrada");

        Registro memory novoRegistro = Registro({
            registrador: msg.sender,
            tipoDocumento: tipoDocumento,
            codigoCAR: codigoCAR,
            latitude: latitude,
            longitude: longitude,
            dataRegistro: block.timestamp,
            existe: true
        });

        registros[hashProva] = novoRegistro;

        // O evento deixa um rastro público para consulta em exploradores e integrações futuras.
        emit ProvaRegistrada(
            hashProva,
            msg.sender,
            tipoDocumento,
            codigoCAR,
            latitude,
            longitude,
            block.timestamp
        );
    }

    function existeProva(bytes32 hashProva) external view override returns (bool) {
        return registros[hashProva].existe;
    }

    function obterRegistro(
        bytes32 hashProva
    )
        external
        view
        override
        returns (
            address registrador,
            string memory tipoDocumento,
            string memory codigoCAR,
            string memory latitude,
            string memory longitude,
            uint256 dataRegistro,
            bool existe
        )
    {
        Registro memory registro = registros[hashProva];
        require(registro.existe, "Prova nao encontrada");

        return (
            registro.registrador,
            registro.tipoDocumento,
            registro.codigoCAR,
            registro.latitude,
            registro.longitude,
            registro.dataRegistro,
            registro.existe
        );
    }
}
