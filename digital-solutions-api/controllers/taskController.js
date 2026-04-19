const db = require('../config/db');

// @route   GET /api/tasks/project/:projectId
// @desc    Lister les tâches d'un projet
// @access  Privé
const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await db.query(
      'SELECT t.*, u.nom as assigne_nom FROM tasks t LEFT JOIN users u ON t.assigne_a = u.id WHERE t.projet_id = $1 ORDER BY t.echeance ASC',
      [projectId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur getTasksByProject:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des tâches.' });
  }
};

// @route   POST /api/tasks
// @desc    Ajouter une tâche à un projet
// @access  Privé
const createTask = async (req, res) => {
  const { projet_id, titre, description, echeance, assigne_a } = req.body;

  if (!projet_id || !titre) {
    return res.status(400).json({ message: 'L\'ID du projet et le titre sont requis.' });
  }

  try {
    // Statut par défaut : "A faire"
    const statut = 'A faire';
    
    // Insérer la tâche
    // Note: UUID est généré par PostgreSQL si configuré, sinon il faudra utiliser la fonction gen_random_uuid() 
    // selon la version. On suppose que la table l'utilise comme default ou qu'il sera généré auto
    const result = await db.query(
      'INSERT INTO tasks (projet_id, titre, description, assigne_a, statut, echeance) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [projet_id, titre, description, assigne_a || null, statut, echeance || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur createTask:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la tâche.' });
  }
};

// @route   PUT /api/tasks/:id/status
// @desc    Modifier le statut d'une tâche
// @access  Privé
const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  const validStatuses = ['A faire', 'En cours', 'Terminé'];

  if (!validStatuses.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur updateTaskStatus:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la modification du statut.' });
  }
};

// @route   PUT /api/tasks/:id/assign
// @desc    Assigner une tâche à un utilisateur
// @access  Privé
const assignTask = async (req, res) => {
  const { id } = req.params;
  const { assigne_a } = req.body;

  if (!assigne_a) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur assigné est requis.' });
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET assigne_a = $1 WHERE id = $2 RETURNING *',
      [assigne_a, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tâche introuvable.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur assignTask:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'assignation de la tâche.' });
  }
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  assignTask
};
