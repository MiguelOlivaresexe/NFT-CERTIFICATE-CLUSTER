import { useState } from "react";
import axios from "axios";

function AdminPanel({ contract, account }) {
  const [tokenIdBurn, setTokenIdBurn] = useState("");
  const [tokenIdTransfer, setTokenIdTransfer] = useState("");
  const [toAddressTransfer, setToAddressTransfer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBurn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    if (!tokenIdBurn) {
      setError("Por favor, introduce un Token ID para quemar.");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      await axios.delete(`${API_BASE}/api/fake-smart-contracts/${tokenIdBurn}`);
      setMessage(`Documento con Token ID ${tokenIdBurn} eliminado.`);
      setTokenIdBurn("");
      window.dispatchEvent(new CustomEvent("documentMinted"));
    } catch (err) {
      setError(`Error al eliminar: ${err.response?.data?.msg || err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    if (!tokenIdTransfer || !toAddressTransfer) {
      setError(
        "Por favor, introduce un Token ID y una dirección de destino para transferir.",
      );
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      await axios.put(`${API_BASE}/api/fake-smart-contracts/${tokenIdTransfer}`, {
        owner: toAddressTransfer,
      });
      setMessage(`Documento ${tokenIdTransfer} transferido a ${toAddressTransfer}.`);
      setTokenIdTransfer("");
      setToAddressTransfer("");
      window.dispatchEvent(new CustomEvent("documentMinted"));
    } catch (err) {
      setError(`Error al transferir: ${err.response?.data?.msg || err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-red-300">
          Quemar Documento (Burn)
        </h3>
        <form onSubmit={handleBurn} className="space-y-4">
          <div>
            <label
              htmlFor="tokenIdBurn"
              className="block text-sm font-medium text-gray-300"
            >
              Token ID a Quemar
            </label>
            <input
              type="text"
              id="tokenIdBurn"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:ring-red-500 focus:border-red-500"
              value={tokenIdBurn}
              onChange={(e) => setTokenIdBurn(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Quemando..." : "Quemar Documento"}
          </button>
        </form>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          Transferir Propiedad (Safe Transfer)
        </h3>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label
              htmlFor="tokenIdTransfer"
              className="block text-sm font-medium text-gray-300"
            >
              Token ID a Transferir
            </label>
            <input
              type="text"
              id="tokenIdTransfer"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:ring-green-500 focus:border-green-500"
              value={tokenIdTransfer}
              onChange={(e) => setTokenIdTransfer(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="toAddressTransfer"
              className="block text-sm font-medium text-gray-300"
            >
              Dirección de Destino
            </label>
            <input
              type="text"
              id="toAddressTransfer"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:ring-green-500 focus:border-green-500"
              value={toAddressTransfer}
              onChange={(e) => setToAddressTransfer(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Transfiriendo..." : "Transferir Documento"}
          </button>
        </form>
      </div>

      {message && <p className="mt-4 text-green-400 text-sm">{message}</p>}
      {error && <p className="mt-4 text-red-400 text-sm">Error: {error}</p>}
    </div>
  );
}

export default AdminPanel;
