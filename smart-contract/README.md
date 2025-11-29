# Proyecto Smart Contract: DocumentNFT

Este repositorio contiene los contratos inteligentes para el sistema DocumentNFT, implementado con upgradeabilidad UUPS de OpenZeppelin, ERC721 y control de acceso.

## Estructura del Proyecto

```
smart-contract/
├─ contracts/
│  ├─ DocumentNFT.sol        # Implementación upgradeable UUPS + ERC721
│  ├─ DocumentNFT_v2.sol     # Versión upgrade con función `version()`
├─ scripts/
│  ├─ deploy_proxy.js        # Script para desplegar la implementación y el proxy
│  ├─ upgrade_to_v2.js       # Script para demostrar el upgrade a v2
│  ├─ mint_sample.js         # Script para mintear un NFT de ejemplo
├─ test/
│  ├─ document.test.js       # Pruebas unitarias (mocha/chai)
├─ hardhat.config.js
├─ package.json
└─ README.md
```

## Requisitos

*   Node.js (v18 o superior)
*   npm (v8 o superior)

## Configuración e Instalación

1.  **Clonar el repositorio** (si aún no lo has hecho):

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd smart-contract
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

## Uso

### 1. Iniciar un nodo Hardhat local

Para desplegar y probar los contratos, necesitarás un nodo Hardhat local en ejecución. Abre una nueva terminal en el directorio `smart-contract` y ejecuta:

```bash
npx hardhat node
```

Esto iniciará un nodo local en `http://127.0.0.1:8545` y generará 20 cuentas de prueba con Ether.

### 2. Desplegar el contrato DocumentNFT (v1)

En una terminal **diferente** (mientras el nodo Hardhat sigue ejecutándose), ejecuta el script de despliegue:

```bash
npx hardhat run scripts/deploy_proxy.js --network localhost
```

Este script desplegará la implementación `DocumentNFT` y un proxy UUPS, e imprimirá sus direcciones. Guarda la dirección del proxy, la necesitarás para el frontend y para el upgrade.

### 3. Mintear un NFT de ejemplo

Para mintear un NFT de ejemplo, puedes usar el script `mint_sample.js`. Asegúrate de tener la dirección del proxy del paso anterior. Puedes pasarla como variable de entorno `PROXY_ADDRESS`.

```bash
PROXY_ADDRESS=<DIRECCION_DEL_PROXY> npx hardhat run scripts/mint_sample.js --network localhost
```

Reemplaza `<DIRECCION_DEL_PROXY>` con la dirección del proxy obtenida en el paso de despliegue.

### 4. Actualizar el contrato a DocumentNFT (v2)

Para demostrar la capacidad de actualización, puedes usar el script `upgrade_to_v2.js`. De nuevo, necesitarás la dirección del proxy.

```bash
PROXY_ADDRESS=<DIRECCION_DEL_PROXY> npx hardhat run scripts/upgrade_to_v2.js --network localhost
```

Este script actualizará el proxy a la implementación `DocumentNFT_v2` y verificará la nueva función `version()`.

### 5. Ejecutar pruebas unitarias

Para ejecutar las pruebas unitarias de los contratos inteligentes, usa el siguiente comando:

```bash
npx hardhat test
```

Esto ejecutará todas las pruebas definidas en `test/document.test.js`.