import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ isSimulated }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      if (isSimulated) {
        // En modo simulado, no hacemos llamadas al backend para documentos
        setDocuments([]); // O podrías cargar datos de prueba aquí
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token de autenticación. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get('/api/documents/all', config);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error al obtener todos los documentos:', err);
        setError('Error al cargar los documentos. Asegúrate de tener permisos de administrador.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, []);

  if (loading) {
    return <div className="text-gray-700 dark:text-gray-300">Cargando todos los documentos...</div>;
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dashboard de Administración - Todos los Documentos</h2>
      {Array.isArray(documents) && documents.length === 0 ? (
        <p className="text-gray-600">No hay documentos en el sistema.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-left text-sm font-semibold rounded-tl-lg">Token ID</th>
                <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-left text-sm font-semibold">Propietario</th>
                <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-left text-sm font-semibold">CID IPFS</th>
                <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-left text-sm font-semibold rounded-tr-lg">Fecha de Acuñación</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(documents) && documents.map((doc) => (
                <tr key={doc._id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{doc.tokenId}</td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{doc.owner}</td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                    {doc.cid ? (
                      <a
                        href={`https://ipfs.io/ipfs/${doc.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        {doc.cid}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{new Date(doc.mintedAt).toLocaleDateString()}</td>
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
