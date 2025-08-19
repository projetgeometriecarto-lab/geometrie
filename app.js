const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// CORS permissif
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Log pour debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mémoire temporaire (non persistante)
let retouches = [];

// GET /retouches → récupère la liste
app.get('/retouches', (req, res) => {
  res.json(retouches);
});

// POST /retouches → enregistre une retouche
app.post('/retouches', (req, res) => {
  const retouche = req.body;
  if (!retouche.zone || !retouche.defauts || !retouche.codecls || !retouche.heure) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  retouches.push(retouche);
  res.status(200).json({ message: 'Retouche enregistrée avec succès' });
});

// DELETE /retouches/last → supprimer la dernière retouche
app.delete('/retouches/last', (req, res) => {
  if (retouches.length === 0) {
    return res.status(404).json({ error: 'Aucune retouche à supprimer' });
  }
  retouches.pop();
  res.json({ message: 'Dernière retouche supprimée' });
});

// DELETE /retouches → supprimer toutes les retouches
app.delete('/retouches', (req, res) => {
  retouches = [];
  res.json({ message: 'Toutes les retouches supprimées' });
});

// Lancer le serveur **à la fin**
app.listen(port, () => {
  console.log(`✅ Serveur Express en ligne sur http://localhost:${port}`);
});

