require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const fakeSmartContractRoutes = require("./routes/fakeSmartContractRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado a MongoDB");

    // Seed admin user if not exists
    try {
      const adminUser = process.env.ADMIN_USERNAME || "admin";
      const adminPass = process.env.ADMIN_PASSWORD || "Password123";

      const existing = await User.findOne({ username: adminUser });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(adminPass, salt);
        const newAdmin = new User({ username: adminUser, password: hashed, role: 'admin' });
        await newAdmin.save();
        console.log(`Usuario admin creado: ${adminUser}`);
      } else {
        console.log(`Usuario admin existente: ${adminUser}`);
      }
    } catch (e) {
      console.error("Error al crear/verificar admin:", e);
    }
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

app.use(express.json()); // Middleware para parsear JSON
// CORS para permitir llamadas desde el frontend en desarrollo
app.use(cors());

// Simple request logger: escribe en consola y en backend/server.log
app.use((req, res, next) => {
  try {
    const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${JSON.stringify(req.body || {})}\n`;
    console.log(entry.trim());
    fs.appendFileSync("server.log", entry);
  } catch (e) {
    console.error("Logger error:", e);
  }
  next();
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);
// Rutas de documentos
app.use("/api/documents", documentRoutes);
// Rutas de contratos inteligentes ficticios
app.use("/api/fake-smart-contracts", fakeSmartContractRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend de Smart Diploma funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
