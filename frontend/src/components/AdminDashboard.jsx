import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ isSimulated }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllDocuments = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/fake-smart-contracts`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Error al obtener todos los documentos:', err);
      setError('Error al cargar los documentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();

    const onMinted = () => {
      setLoading(true);
      fetchAllDocuments();
    };

    window.addEventListener('documentMinted', onMinted);
    return () => {
      window.removeEventListener('documentMinted', onMinted);
    };
  }, [isSimulated]);

  if (loading) {
    return <div className="text-gray-700 dark:text-gray-300">Cargando todos los documentos...</div>;
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dashboard de Administración - Todos los Documentos</h2>
      {Array.isArray(documents) && documents.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay documentos en el sistema.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 dark:bg-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white text-left text-sm font-semibold rounded-tl-lg">ID MongoDB</th>
                <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white text-left text-sm font-semibold">Token ID</th>
                <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white text-left text-sm font-semibold">Propietario</th>
                <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white text-left text-sm font-semibold">CID IPFS</th>
                <th className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white text-left text-sm font-semibold rounded-tr-lg">Fecha de Acuñación</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(documents) && documents.map((doc) => (
                <tr key={doc._id} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{doc._id}</td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{doc.tokenId}</td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{doc.owner}</td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {doc.cid ? (
                      <a
                        href={`https://ipfs.io/ipfs/${doc.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {doc.cid}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{new Date(doc.createdAt || doc.updatedAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
