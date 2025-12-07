import { useState } from "react";
import axios from "axios";

function QueryForm({ contract }) {
  const [tokenId, setTokenId] = useState("");
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDocumentData(null);
    setError(null);

    if (!tokenId) {
      setError("Por favor, introduce un Token ID.");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE}/api/fake-smart-contracts/${tokenId}`);
      const doc = res.data;
      setDocumentData({
        cid: doc.cid,
        documentHash: doc.documentHash,
        owner: doc.owner,
        exists: !!doc && !!doc.tokenId,
      });
    } catch (err) {
      setDocumentData({ exists: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleQuery} className="space-y-4">
      <div>
        <label
          htmlFor="tokenId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Token ID
        </label>
        <input
          type="text"
          id="tokenId"
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Consultando..." : "Consultar Documento"}
      </button>

      {documentData && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
            Detalles del Documento
          </h3>
          {documentData.exists ? (
            <>
              <p>
                <strong>CID:</strong> {documentData.cid}
              </p>
              <p>
                <strong>Hash del Documento:</strong> {documentData.documentHash}
              </p>
              <p>
                <strong>Propietario:</strong> {documentData.owner}
              </p>
              {documentData.cid && !documentData.cid.startsWith("local-") ? (
                <a
                  href={`https://ipfs.io/ipfs/${documentData.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-300 hover:underline"
                >
                  Ver Metadatos en IPFS
                </a>
              ) : (
                <p className="text-yellow-600 dark:text-yellow-300">
                  Metadatos guardados localmente en modo demo.
                </p>
              )}
            </>
          ) : (
            <p>El documento con el Token ID {tokenId} no existe.</p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-sm">Error: {error}</p>}
    </form>
  );
}

export default QueryForm;
