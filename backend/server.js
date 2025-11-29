require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.json()); // Middleware para parsear JSON

// Rutas de autenticación
app.use('/api/auth', authRoutes);
// Rutas de documentos
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.send('Backend de Smart Diploma funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
