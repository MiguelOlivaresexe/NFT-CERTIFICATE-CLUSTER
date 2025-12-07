import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setError("No hay token de autenticación. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/documents", {
          headers: {
            "x-auth-token": authToken,
          },
        });
        setDocuments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "Error al obtener documentos:",
          err.response ? err.response.data : err.message,
        );
        setError(err.response?.data?.msg || "Error al cargar los documentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="text-gray-700 dark:text-gray-300 text-center">Cargando documentos...</div>;
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400 text-center">Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
        Mis Documentos Minteados
      </h3>
      {documents.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No tienes documentos minteados aún.</p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow">
              <p className="text-gray-900 dark:text-white">
                <strong>Token ID:</strong> {doc.tokenId}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Minteado el: {new Date(doc.mintedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDocuments;
