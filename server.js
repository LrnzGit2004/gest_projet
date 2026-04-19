const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux requis
app.use(helmet()); // Sécurité des headers HTTP
app.use(cors()); // Protection CORS configurée
app.use(express.json()); // Parser le corps des requêtes en JSON

// Route de santé (Healthcheck)
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "API Digital Solutions en ligne." });
});

// Import des routes
const authRoutes = require("./digital-solutions-api/routes/authRoutes");
const projectRoutes = require("./digital-solutions-api/routes/projectRoutes");
const taskRoutes = require("./digital-solutions-api/routes/taskRoutes");

// Montage des routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
