const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Récupération de l'en-tête Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Aucun token valide fourni." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Vérifier le token avec la clé secrète (assumant JWT_SECRET dans .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
    
    // Assigner l'utilisateur dans la requête pour son utilisation ultérieure dans les contrôleurs
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
