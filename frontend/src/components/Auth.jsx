import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importar iconos
import axios from 'axios';

const Auth = ({ setAuthToken }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Lógica de autenticación hardcodeada para admin
    if (username === 'admin' && password === '123') {
      setAuthToken('dummy-admin-token'); // Token simulado
      localStorage.setItem('token', 'dummy-admin-token');
      setMessage('Inicio de sesión de administrador exitoso.');
      return;
    }

    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await axios.post(url, { username, password });
      setAuthToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage(isRegister ? 'Registro exitoso. ¡Bienvenido!' : 'Inicio de sesión exitoso.');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : 'Error en la autenticación');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl animate-fade-in relative overflow-hidden">
      {/* Fondo de textura sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-75 z-0 transition-all duration-300 hover:opacity-100"></div>
      <div className="relative z-10">
      <h2 className="text-2xl font-semibold mb-4 text-white text-center">
        {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Usuario:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Contraseña:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 mb-3"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-400 hover:text-blue-300 font-bold focus:outline-none"
        >
          {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </p>
      {message && (
        <p className="mt-4 text-center text-white animate-fade-in">
          {message}
        </p>
      )}
      </div>
    </div>
  );
};

export default Auth;
