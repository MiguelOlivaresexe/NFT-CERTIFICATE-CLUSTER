import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importar iconos
import axios from "axios";
import { getApiErrorMessage } from "../utils/apiError";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

const Auth = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (username.trim() === "") {
      setMessage("El nombre de usuario no puede estar vacío.");
      return;
    }

    if (password.trim() === "") {
      setMessage("La contraseña no puede estar vacía.");
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      if (res.data.role) {
        localStorage.setItem('role', res.data.role);
      }
      setMessage("Inicio de sesión exitoso.");
      navigate('/'); // Redirigir a la página principal después del login
    } catch (err) {
      console.error(err);
      setMessage(getApiErrorMessage(err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 pr-10 text-gray-900 dark:text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300 mb-3"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full">Iniciar Sesión</button>
      </form>
      <p className="mt-4 text-center text-gray-500 dark:text-gray-300">
        ¿No tienes una cuenta? {" "}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold focus:outline-none">Registrarse</Link>
      </p>
      {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Dashboard General</h3>
        {token && role !== 'admin' ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <AdminDashboard isSimulated={false} />
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">Inicia sesión para ver el Dashboard General.</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
