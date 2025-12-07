import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import MintForm from "./MintForm";
import QueryForm from "./QueryForm";
import Auth from "./Auth"; // Importar el nuevo componente Auth
import RegisterForm from "./RegisterForm"; // Importar el nuevo componente RegisterForm
import UserDocuments from "./UserDocuments"; // Importar el nuevo componente UserDocuments
import AdminDashboard from "./AdminDashboard"; // Importar el nuevo componente AdminDashboard
const AdminPanel = lazy(() => import("./AdminPanel"));
import DocumentNFT_ABI from "../abi/DocumentNFT.json";
import FakeDocumentNFT from "../sim/FakeDocumentNFT";

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
  const [authToken, setAuthToken] = useState(localStorage.getItem("token")); // Estado para el token de autenticación
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#FFFFFF"); // Estado para el color de fondo de la página, por defecto blanco
  const [theme, setTheme] = useState("light");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setAccount(null);
    setSigner(null);
    setContract(null);
    setIsAdmin(false);
    setIsSimulated(false);
  };

  useEffect(() => {
    console.log("Current authToken:", authToken);
    const setupWallet = async (currentProvider) => {
      try {
        setLoading(true);
        setError(null);

        let ethProvider;
        if (currentProvider) {
          ethProvider = currentProvider;
          // @ts-ignore
        } else if (window.ethereum) {
          // @ts-ignore
          ethProvider = new ethers.BrowserProvider(window.ethereum);
        } else {
          // Fallback for simulation mode
          const stored = localStorage.getItem("simAccount");
          const sim =
            stored ||
            `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
          if (!stored) localStorage.setItem("simAccount", sim);
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

          // @ts-ignore
          const nftContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            // @ts-ignore
            DocumentNFT_ABI,
            ethSigner,
          );
          setContract(nftContract);

          const adminRole = await nftContract.DEFAULT_ADMIN_ROLE();
          const hasAdminRole = await nftContract.hasRole(
            adminRole,
            currentAccount,
          );
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
      setupWallet();
    } else {
      setLoading(false); // Si no hay token, no estamos cargando la DApp, sino esperando el login
    }

    // @ts-ignore
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

      // @ts-ignore
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      // @ts-ignore
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        // @ts-ignore
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        // @ts-ignore
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [authToken]); // Dependencia de authToken para re-ejecutar cuando cambie

  const connectWallet = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // @ts-ignore
      // No recargar la página, setupWallet se encargará de actualizar el estado
    } catch (err) {
      console.error("Error al conectar la cartera:", err);
      setError(
        "No se pudo conectar la cartera. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando DApp...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-900 text-white text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/*"
          element={authToken ? (
            <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="min-h-screen" style={{ backgroundColor: pageBackgroundColor }}>
              <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  Sistema NFT de Documentos
                </h1>
                <div className="flex items-center">
                  <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="mr-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-3 py-1 rounded"
                  >
                    {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                  </button>
                  <input
                    type="color"
                    value={pageBackgroundColor}
                    onChange={(e) => setPageBackgroundColor(e.target.value)}
                    className="mr-4 p-1 h-8 w-8 block bg-white border border-gray-300 cursor-pointer rounded-md focus:outline-none"
                  />
                  {isSimulated && (
                    <span className="bg-green-500 text-green-900 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                      Modo Activado
                    </span>
                  )}
                  {account ? (
                    <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
                      Conectado: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </span>
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Conectar Cartera
                    </button>
                  )}
                  {authToken && (
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                      Cerrar Sesión
                    </button>
                  )}
                </div>
              </div>

              <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-center space-x-4">
                <a href="#mint" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">Mintear Documento</a>
                <a href="#query" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">Consultar Documento</a>
                <a href="#my-documents" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">Mis Documentos</a>
                {isAdmin && (
                  <a href="#admin-dashboard" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">Admin Dashboard</a>
                )}
                {isAdmin && (
                  <a href="#admin-panel" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200">Admin Panel</a>
                )}
              </nav>

              <main className="p-8">
                <section id="mint" className="mb-8">
                  <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Mintear Nuevo Documento</h2>
                  <MintForm contract={contract} account={account} />
                </section>

                <section id="query" className="mb-8">
                  <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Consultar Documento por Token ID</h2>
                  <QueryForm contract={contract} />
                </section>

                <section id="my-documents" className="mb-8">
                  <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Mis Documentos</h2>
                  <UserDocuments />
                </section>

                {isAdmin && (
                <section id="admin-dashboard" className="mb-8">
                    <AdminDashboard isSimulated={isSimulated} />
                  </section>
                )}

                {isAdmin && (
                  <Suspense fallback={<div>Cargando Panel de Administración...</div>}>
                    <section id="admin-panel" className="mb-8">
                      <AdminPanel contract={contract} account={account} />
                    </section>
                  </Suspense>
                )}
              </main>
            </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
