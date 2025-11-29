# Sistema NFT de Documentos

## Descripción Breve

Este proyecto es una DApp (Aplicación Descentralizada) que permite la gestión de documentos como NFTs (Tokens No Fungibles) en la blockchain. Los usuarios pueden mintear, consultar y verificar la autenticidad de documentos, mientras que los administradores tienen funcionalidades adicionales para la creación y edición de los mismos. La aplicación soporta un modo simulado para desarrollo y pruebas sin necesidad de una conexión a una red blockchain real.

## Estructura del Proyecto

El proyecto está organizado en tres directorios principales:

-   `frontend/`: Contiene la aplicación web construida con React y Vite.
-   `backend/`: Contiene el servidor API RESTful construido con Node.js y Express.
-   `smart-contract/`: Contiene los contratos inteligentes de Ethereum, scripts de despliegue y pruebas.

## Stack Tecnológico Detallado

### Frontend

-   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
-   **Vite**: Herramienta de construcción rápida para proyectos web modernos.
-   **Axios**: Cliente HTTP basado en promesas para realizar solicitudes a la API.
-   **Ethers.js**: Biblioteca para interactuar con la blockchain de Ethereum.
-   **IPFS HTTP Client**: Para interactuar con el sistema de archivos interplanetario (IPFS) para el almacenamiento descentralizado de documentos.
-   **Tailwind CSS**: Framework CSS de utilidad para un diseño rápido y responsivo.
-   **Heroicons**: Conjunto de iconos SVG para la interfaz de usuario.

### Backend

-   **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
-   **Express.js**: Framework web para Node.js para construir APIs RESTful.
-   **MongoDB**: Base de datos NoSQL para almacenar información de usuarios y documentos.
-   **Mongoose**: Modelado de objetos MongoDB para Node.js.
-   **bcryptjs**: Librería para el hash de contraseñas.
-   **jsonwebtoken**: Implementación de JSON Web Tokens para autenticación.
-   **dotenv**: Para cargar variables de entorno desde un archivo `.env`.

### Smart Contracts

-   **Solidity**: Lenguaje de programación para escribir contratos inteligentes.
-   **Hardhat**: Entorno de desarrollo para compilar, desplegar, probar y depurar contratos inteligentes de Ethereum.
-   **OpenZeppelin Contracts Upgradeable**: Librerías de contratos inteligentes seguros y actualizables.
-   **Ethers.js**: Utilizado en scripts de Hardhat para interactuar con los contratos.
-   **Chai**: Framework de aserciones para pruebas.
-   **Mocha**: Framework de pruebas para JavaScript.

## Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

-   **Node.js** (versión 18 o superior recomendada)
-   **npm** o **Yarn** (gestores de paquetes de Node.js)
-   **MetaMask** (extensión del navegador para interactuar con la blockchain, si no usas el modo simulado)
-   **Git** (para clonar el repositorio)

## Configuración del Entorno

Cada parte del proyecto (`frontend`, `backend`, `smart-contract`) requiere un archivo `.env` para su configuración.

### Backend (`backend/.env`)

Crea un archivo llamado `.env` en el directorio `backend/` con el siguiente contenido:

```
MONGO_URI=mongodb://localhost:27017/documentnft
JWT_SECRET=tu_secreto_jwt_seguro
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123
```

-   `MONGO_URI`: La URL de conexión a tu base de datos MongoDB. Si usas MongoDB local, `mongodb://localhost:27017/documentnft` es un valor común.
-   `JWT_SECRET`: Una cadena de texto secreta para firmar los tokens JWT. Genera una cadena larga y aleatoria para mayor seguridad.
-   `ADMIN_USERNAME`: Nombre de usuario para el administrador (por defecto: `admin`).
-   `ADMIN_PASSWORD`: Contraseña para el administrador (por defecto: `123`).

### Frontend (`frontend/.env`)

Crea un archivo llamado `.env` en el directorio `frontend/` con el siguiente contenido:

```
VITE_DOCUMENT_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

-   `VITE_DOCUMENT_NFT_CONTRACT_ADDRESS`: La dirección del contrato inteligente `DocumentNFT` desplegado. Este valor se obtendrá después de desplegar el contrato inteligente. El valor proporcionado es un ejemplo para desarrollo local.

### Smart Contract (`smart-contract/.env`)

Crea un archivo llamado `.env` en el directorio `smart-contract/` con el siguiente contenido:

```
ALCHEMY_API_KEY=tu_clave_api_alchemy
PRIVATE_KEY=tu_clave_privada_metamask
```

-   `ALCHEMY_API_KEY`: Tu clave API de Alchemy (o Infura) para interactuar con redes Ethereum públicas. Necesario solo si despliegas en redes de prueba o principales.
-   `PRIVATE_KEY`: La clave privada de tu cuenta de MetaMask. **¡Úsala con precaución y solo para redes de prueba!**

## Instalación

Sigue estos pasos para instalar las dependencias de cada parte del proyecto:

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd smart_diploma
    ```

2.  **Instalar dependencias del Backend:**

    ```bash
    cd backend
    npm install # o yarn install
    cd ..
    ```

3.  **Instalar dependencias del Frontend:**

    ```bash
    cd frontend
    npm install # o yarn install
    cd ..
    ```

4.  **Instalar dependencias del Smart Contract:**

    ```bash
    cd smart-contract
    npm install # o yarn install
    cd ..
    ```

## Ejecución de la Aplicación

### 1. Iniciar el Backend

Asegúrate de tener un servidor MongoDB en ejecución. Luego, inicia el servidor backend:

```bash
cd backend
node server.js
```

El backend se ejecutará en `http://localhost:5000` (o el puerto configurado).

### 2. Desplegar Contratos Inteligentes (Opcional, para desarrollo local)

Si deseas desplegar los contratos inteligentes en una red local de Hardhat (para desarrollo y pruebas), sigue estos pasos. Si solo quieres usar el modo simulado del frontend, puedes omitir este paso.

```bash
cd smart-contract
npx hardhat node # Inicia un nodo local de Hardhat en una nueva terminal
```

En otra terminal, despliega el contrato:

```bash
cd smart-contract
npx hardhat run scripts/deploy_proxy.js --network localhost
```

**Nota:** La dirección del contrato desplegado se mostrará en la consola. Deberás actualizar `VITE_DOCUMENT_NFT_CONTRACT_ADDRESS` en `frontend/.env` con esta dirección.

### 3. Iniciar el Frontend

```bash
cd frontend
npm run dev # o yarn dev
```

El frontend se ejecutará en `http://localhost:5173` (o el puerto que Vite asigne).

## Uso de la Aplicación

### Modo de Usuario Normal (con MetaMask)

1.  Asegúrate de que MetaMask esté conectado a la red donde desplegaste el contrato (por ejemplo, Hardhat Network local).
2.  Conecta tu cartera de MetaMask a la aplicación.
3.  Podrás mintear nuevos documentos y consultar documentos existentes.

### Modo de Administrador (Simulado)

Para acceder al panel de administración y la funcionalidad de edición de documentos en un entorno simulado (sin necesidad de una blockchain real o MetaMask):

1.  En la página de inicio de sesión, usa las siguientes credenciales:
    -   **Usuario:** `admin`
    -   **Contraseña:** `123`
2.  Al iniciar sesión con estas credenciales, la aplicación entrará en un "modo demo" donde los datos se guardan localmente en el navegador.
3.  Tendrás acceso al `AdminPanel` para crear y editar documentos.

---

¡Eso es todo! Con estos pasos, deberías poder configurar y ejecutar la aplicación sin problemas.
