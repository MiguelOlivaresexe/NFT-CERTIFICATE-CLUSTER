// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DocumentNFT.sol";

contract DocumentNFT_v2 is DocumentNFT {
    function version() public pure returns (string memory) {
        return "v2";
    }

    // Se puede agregar más lógica o modificar funciones existentes aquí
    // Asegúrate de mantener el storage layout compatible con la v1

    uint256[49] private __gap_v2; // Ajustar el gap si se añaden nuevas variables de estado
}