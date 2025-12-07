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
│  │  ├─ UserDocuments.jsx   # Componente para mostrar documentos del usuario
│  │  ├─ AdminDashboard.jsx  # Dashboard de administración para todos los documentos
│  │  └─ Auth.jsx            # Componente de autenticación (registro/inicio de sesión)
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

- Node.js (v18 o superior)
- npm (v8 o superior)
- Un nodo Ethereum en ejecución (local o remoto) con el contrato `DocumentNFT` desplegado.
- Un servidor backend en ejecución (ver `backend/README.md` para más detalles).

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

### 2. Funcionalidades Clave

*   **Cambio de Color de Fondo:** El selector de color ahora cambia el color de fondo de toda la página, con un valor predeterminado blanco.
*   **Dashboard de Administración:** Los usuarios con rol de administrador pueden ver todos los documentos minteados en el sistema.
*   **Modo Simulado:** La aplicación puede operar en un modo simulado sin conexión a la blockchain real, utilizando datos almacenados localmente.

### 3. Construir la aplicación para producción

```bash
npm run build
```

Esto generará los archivos estáticos de la aplicación en el directorio `dist/`, listos para ser desplegados en un servidor web.

### 4. Previsualizar la construcción de producción

```bash
npm run preview
```

Esto te permitirá previsualizar la versión de producción de tu aplicación localmente.

---

# Frontend Project: DocumentNFT DApp

This repository contains the frontend application for interacting with DocumentNFT smart contracts. It allows users to mint, query, and manage document NFTs.

## Project Structure

```
frontend/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ abi/
│  │  └─ DocumentNFT.json    # DocumentNFT contract ABI
│  ├─ components/
│  │  ├─ App.jsx             # Main application component
│  │  ├─ MintForm.jsx        # Form for minting new documents
│  │  ├─ QueryForm.jsx       # Form for querying existing documents
│  │  ├─ UserDocuments.jsx   # Component to display user's documents
│  │  ├─ AdminDashboard.jsx  # Admin dashboard for all documents
│  │  └─ Auth.jsx            # Authentication component (register/login)
│  ├─ utils/
│  │  ├─ ipfs.js             # Utilities for interacting with IPFS
│  │  └─ hash.js             # Utilities for document hashing
│  ├─ index.css             # Global application styles
│  └─ main.jsx              # React application entry point
├─ index.html
├─ package.json
└─ README.md
```

## Requirements

- Node.js (v18 or higher)
- npm (v8 or higher)
- An Ethereum node running (local or remote) with the `DocumentNFT` contract deployed.
- A running backend server (see `backend/README.md` for more details).

## Setup and Installation

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone <REPOSITORY_URL>
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure the contract address:**

    You will need to configure the address of the deployed `DocumentNFT` contract. This can be done via environment variables or directly in the code (for development). It is recommended to use a `.env` file.

    Create a `.env` file in the root of the `frontend` directory with the following content:

    ```
    VITE_DOCUMENT_NFT_CONTRACT_ADDRESS="0x..."
    ```

    Replace `0x...` with the address of the `DocumentNFT` contract proxy you obtained after deploying the smart contract.

## Usage

### 1. Start the development application

```bash
npm run dev
```

This will start the Vite development server and open the application in your browser (usually at `http://localhost:5173`).

### 2. Key Features

*   **Background Color Change:** The color picker now changes the background color of the entire page, with a default white value.
*   **Admin Dashboard:** Users with an admin role can view all minted documents in the system.
*   **Simulated Mode:** The application can operate in a simulated mode without a real blockchain connection, using locally stored data.

### 3. Build the application for production

```bash
npm run build
```

This will generate the static files of the application in the `dist/` directory, ready to be deployed to a web server.

### 4. Preview the production build

```bash
npm run preview
```

This will allow you to preview the production version of your application locally.
