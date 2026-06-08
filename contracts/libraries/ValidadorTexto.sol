// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library ValidadorTexto {
    // Mantém as validações textuais obrigatórias consistentes no contrato.
    function validarObrigatorio(
        string memory valor,
        string memory mensagemErro
    ) internal pure {
        require(bytes(valor).length > 0, mensagemErro);
    }
}
