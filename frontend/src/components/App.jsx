import { useState, useEffect, lazy, Suspense } from 'react';
import { ethers } from 'ethers';
import MintForm from './MintForm';
import QueryForm from './QueryForm';
import Auth from './Auth'; // Importar el nuevo componente Auth
import UserDocuments from './UserDocuments'; // Importar el nuevo componente UserDocuments
const AdminPanel = lazy(() => import('./AdminPanel'));
import DocumentNFT_ABI from '../abi/DocumentNFT.json';
import FakeDocumentNFT from '../sim/FakeDocumentNFT';

const CONTRACT_ADDRESS = import.meta.env.VITE_DOCUMENT_NFT_CONTRACT_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token')); // Estado para el token de autenticación

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  useEffect(() => {
    const setupWallet = async (currentProvider) => {
      try {
        setLoading(true);
        setError(null);

        let ethProvider;
        if (currentProvider) {
          ethProvider = currentProvider;
        } else if (window.ethereum) {
          ethProvider = new ethers.BrowserProvider(window.ethereum);
        } else {
          // Fallback for simulation mode
          const stored = localStorage.getItem('simAccount');
          const sim = stored || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
          if (!stored) localStorage.setItem('simAccount', sim);
          setAccount(sim);
          const nftContract = new FakeDocumentNFT(sim);
          setContract(nftContract);
          setIsAdmin(true);
          setIsSimulated(true);
          setLoading(false);
          return;
        }

        setProvider(ethProvider);

        const accounts = await ethProvider.listAccounts();
        if (accounts.length > 0) {
          const currentAccount = accounts[0].address;
          setAccount(currentAccount);
          const ethSigner = await ethProvider.getSigner(currentAccount);
          setSigner(ethSigner);

          const nftContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            DocumentNFT_ABI,
            ethSigner
          );
          setContract(nftContract);

          const adminRole = await nftContract.DEFAULT_ADMIN_ROLE();
          const hasAdminRole = await nftContract.hasRole(adminRole, currentAccount);
          setIsAdmin(hasAdminRole);
          setIsSimulated(false);
        } else {
          setAccount(null);
          setSigner(null);
          setContract(null);
          setIsAdmin(false);
          setIsSimulated(false);
        }
      } catch (err) {
        console.error("Error al inicializar la aplicación:", err);
        setError("Error al inicializar la aplicación.");
      } finally {
        setLoading(false);
      }
    };

    // Solo intentar configurar la cartera si hay un token de autenticación o si estamos en modo simulación
    if (authToken) {
      if (authToken === 'dummy-admin-token') {
        // Configurar el modo de simulación para el administrador
        const sim = localStorage.getItem('simAccount') || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        if (!localStorage.getItem('simAccount')) localStorage.setItem('simAccount', sim);
        setAccount(sim);
        const nftContract = new FakeDocumentNFT(sim);
        setContract(nftContract);
        setIsAdmin(true);
        setIsSimulated(true);
        setLoading(false);
        return;
      }
      setupWallet();
    } else {
      setLoading(false); // Si no hay token, no estamos cargando la DApp, sino esperando el login
    }

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // Desconectado
          setAccount(null);
          setSigner(null);
          setContract(null);
          setIsAdmin(false);
          setIsSimulated(false);
        } else {
          setupWallet(); // Re-setup wallet with new account
        }
      };

      const handleChainChanged = () => {
        setupWallet(); // Re-setup wallet on chain change
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [authToken]); // Dependencia de authToken para re-ejecutar cuando cambie

  const connectWallet = async () => {
    try {
      setLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // No recargar la página, setupWallet se encargará de actualizar el estado
    } catch (err) {
      console.error("Error al conectar la cartera:", err);
      setError("No se pudo conectar la cartera. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && authToken) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Cargando DApp...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-900 text-white text-center p-4">Error: {error}</div>;
  }

  // Si no hay token de autenticación, mostrar el componente de autenticación
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Background+Image')" }}>
        <Auth setAuthToken={setAuthToken} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">Sistema NFT de Documentos</h1>
      {isSimulated && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-yellow-800 text-yellow-200 rounded">
          Modo demo sin blockchain real: los datos se guardan localmente.
        </div>
      )}

      {!account ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg mb-6">Conecta tu cartera para interactuar con la DApp.</p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Conectar Cartera
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg mb-8">Conectado con: <span className="font-mono text-blue-300">{account}</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Mintear Nuevo Documento</h2>
              <MintForm contract={contract} account={account} />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Consultar Documento</h2>
              <QueryForm contract={contract} />
            </div>
          </div>

          <UserDocuments /> {/* Nuevo componente para mostrar documentos del usuario */}

          {isAdmin && (
            <Suspense fallback={<div>Cargando Panel de Administración...</div>}>
              <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">Panel de Administración</h2>
                <AdminPanel contract={contract} account={account} />
              </div>
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

export default App;