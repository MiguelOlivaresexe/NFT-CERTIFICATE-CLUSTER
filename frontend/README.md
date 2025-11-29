# Proyecto Frontend: DocumentNFT DApp

Este repositorio contiene la aplicación frontend para interactuar con los contratos inteligentes de DocumentNFT. Permite a los usuarios mintear, consultar y gestionar NFTs de documentos.

## Estructura del Proyecto

```
frontend/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ abi/
│  │  └─ DocumentNFT.json    # ABI del contrato DocumentNFT
│  ├─ components/
│  │  ├─ App.jsx             # Componente principal de la aplicación
│  │  ├─ MintForm.jsx        # Formulario para mintear nuevos documentos
│  │  ├─ QueryForm.jsx       # Formulario para consultar documentos existentes
│  │  └─ AdminPanel.jsx      # Panel de administración (ej. quemar, transferir)
│  ├─ utils/
│  │  ├─ ipfs.js             # Utilidades para interactuar con IPFS
│  │  └─ hash.js             # Utilidades para hashing de documentos
│  ├─ index.css             # Estilos globales de la aplicación
│  └─ main.jsx              # Punto de entrada de la aplicación React
├─ index.html
├─ package.json
└─ README.md
```

## Requisitos

*   Node.js (v18 o superior)
*   npm (v8 o superior)
*   Un nodo Ethereum en ejecución (local o remoto) con el contrato `DocumentNFT` desplegado.

## Configuración e Instalación

1.  **Clonar el repositorio** (si aún no lo has hecho):

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd frontend
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar la dirección del contrato:**

    Deberás configurar la dirección del contrato `DocumentNFT` desplegado. Esto se puede hacer a través de variables de entorno o directamente en el código (para desarrollo). Se recomienda usar un archivo `.env`.

    Crea un archivo `.env` en la raíz del directorio `frontend` con el siguiente contenido:

    ```
    VITE_DOCUMENT_NFT_CONTRACT_ADDRESS="0x..."
    ```

    Reemplaza `0x...` con la dirección del proxy del contrato `DocumentNFT` que obtuviste al desplegar el smart contract.

## Uso

### 1. Iniciar la aplicación de desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite y abrirá la aplicación en tu navegador (normalmente en `http://localhost:5173`).

### 2. Construir la aplicación para producción

```bash
npm run build
```

Esto generará los archivos estáticos de la aplicación en el directorio `dist/`, listos para ser desplegados en un servidor web.

### 3. Previsualizar la construcción de producción

```bash
npm run preview
```

Esto te permitirá previsualizar la versión de producción de tu aplicación localmente.