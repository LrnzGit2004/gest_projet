const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST /api/auth/register
// @desc    Créer un compte utilisateur
// @access  Public
const register = async (req, res) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Rôle par défaut : Membre
    const role = 'Membre';

    // Insérer dans la base de données
    const result = await db.query(
      'INSERT INTO users (email, password_hash, nom, role, date_inscription) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, nom, role, date_inscription',
      [email, password_hash, nom, role]
    );

    const newUser = result.rows[0];

    // Créer le token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
};

// @route   POST /api/auth/login
// @desc    Connexion de l'utilisateur
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
  }

  try {
    // Vérifier l'utilisateur
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const current_user = result.rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, current_user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Retirer le mot de passe du payload retourné
    const userPayload = {
      id: current_user.id,
      email: current_user.email,
      nom: current_user.nom,
      role: current_user.role
    };

    // Créer le token
    const token = jwt.sign(
      { id: current_user.id, email: current_user.email, role: current_user.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};

module.exports = {
  register,
  login
};
