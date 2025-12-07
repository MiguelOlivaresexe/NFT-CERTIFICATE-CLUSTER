import { useState } from "react";
import axios from "axios"; // Importar axios
import { sha256 } from "../utils/hash";
import { uploadJsonToIpfs } from "../utils/ipfs";
import { getApiErrorMessage } from "../utils/apiError";

function MintForm({ contract, account }) {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    if (!file || !documentName) {
      setError(
        "Por favor, selecciona un archivo y proporciona un nombre para el documento.",
      );
      setLoading(false);
      return;
    }

    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setError("Por favor, introduce un correo electrónico válido.");
      setLoading(false);
      return;
    }

    try {
      // 1. Leer el contenido del archivo
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      // 2. Calcular el hash SHA256 del documento
      const documentHash = sha256(fileBytes);
      setMessage(`Hash del documento calculado: ${documentHash}`);

      // 3. Subir metadatos a IPFS
      const metadata = {
        name: documentName,
        description: `NFT para el documento: ${documentName}`,
        fileHash: documentHash,
        timestamp: new Date().toISOString(),
        // Puedes añadir más campos aquí si es necesario
      };
      setMessage("Subiendo metadatos a IPFS...");
      const ipfsCid = await uploadJsonToIpfs(metadata);
      setMessage(`Metadatos subidos a IPFS con CID: ${ipfsCid}`);

      const tokenId = Math.floor(Date.now());
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
          const res = await axios.post(
            `${API_BASE}/api/fake-smart-contracts`,
            { tokenId, cid: ipfsCid, documentHash, owner: account, recipientEmail, name: documentName },
          );
          const saved = res.data;
          const mongoId = saved?._id || tokenId;
          setMessage(`ID MongoDB: ${mongoId}`);
          window.dispatchEvent(new CustomEvent("documentMinted"));
        } catch (saveErr) {
          console.error("Error al guardar/enviar el documento:", saveErr);
          setError(getApiErrorMessage(saveErr));
        }
      } else {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
          const res = await axios.post(
            `${API_BASE}/api/fake-smart-contracts`,
            { tokenId, cid: ipfsCid, documentHash, owner: account, recipientEmail, name: documentName },
          );
          const saved = res.data;
          const mongoId = saved?._id || tokenId;
          setMessage(`ID MongoDB: ${mongoId}`);
          window.dispatchEvent(new CustomEvent("documentMinted"));
        } catch (saveErr) {
          console.error("Error al guardar/enviar el documento:", saveErr);
          setError(getApiErrorMessage(saveErr));
        }
      }
      setFile(null);
      setDocumentName("");
      setRecipientEmail("");
    } catch (err) {
      console.error("Error al mintear el documento:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="space-y-4">
      <div>
        <label
          htmlFor="documentName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nombre del Documento
        </label>
        <input
          type="text"
          id="documentName"
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="recipientEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Correo del destinatario
        </label>
        <input
          type="email"
          id="recipientEmail"
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="documentFile"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Seleccionar Documento
        </label>
        <input
          type="file"
          id="documentFile"
          className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Minteando..." : "Mintear Documento"}
      </button>

      {message && <p className="mt-4 text-green-400 text-sm">{message}</p>}
      {error && <p className="mt-4 text-red-400 text-sm">Error: {error}</p>}
    </form>
  );
}

export default MintForm;
