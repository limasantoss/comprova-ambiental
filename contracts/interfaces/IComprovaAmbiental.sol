// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IComprovaAmbiental {
    struct Registro {
        address registrador;
        string tipoDocumento;
        string codigoCAR;
        string latitude;
        string longitude;
        uint256 dataRegistro;
        bool existe;
    }

    event ProvaRegistrada(
        bytes32 indexed hashProva,
        address indexed registrador,
        string tipoDocumento,
        string codigoCAR,
        string latitude,
        string longitude,
        uint256 dataRegistro
    );

    function registrarProva(
        bytes32 hashProva,
        string calldata tipoDocumento,
        string calldata codigoCAR,
        string calldata latitude,
        string calldata longitude
    ) external;

    function existeProva(bytes32 hashProva) external view returns (bool);

    function obterRegistro(
        bytes32 hashProva
    )
        external
        view
        returns (
            address registrador,
            string memory tipoDocumento,
            string memory codigoCAR,
            string memory latitude,
            string memory longitude,
            uint256 dataRegistro,
            bool existe
        );
}
