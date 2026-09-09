const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function leerDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8') || '{}');
  } catch {
    return {};
  }
}

function guardarDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function limpiar(texto) {
  return String(texto || '').trim().slice(0, 500);
}

// Crear un hilo nuevo con el primer mensaje
app.post('/api/hilos', (req, res) => {
  const mensaje = limpiar(req.body.mensaje);
  if (!mensaje) return res.status(400).json({ error: 'Mensaje vacío' });

  const db = leerDB();
  const id = crypto.randomBytes(4).toString('hex');
  db[id] = {
    creado: Date.now(),
    mensajes: [{ texto: mensaje, fecha: Date.now() }]
  };
  guardarDB(db);
  res.json({ id });
});

// Obtener un hilo y sus mensajes
app.get('/api/hilos/:id', (req, res) => {
  const db = leerDB();
  const hilo = db[req.params.id];
  if (!hilo) return res.status(404).json({ error: 'No encontrado' });
  res.json(hilo);
});

// Responder anónimamente a un hilo
app.post('/api/hilos/:id/responder', (req, res) => {
  const mensaje = limpiar(req.body.mensaje);
  if (!mensaje) return res.status(400).json({ error: 'Mensaje vacío' });

  const db = leerDB();
  const hilo = db[req.params.id];
  if (!hilo) return res.status(404).json({ error: 'No encontrado' });

  hilo.mensajes.push({ texto: mensaje, fecha: Date.now() });
  guardarDB(db);
  res.json({ ok: true });
});

// Página pública del hilo (link compartible)
app.get('/hilo/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thread.html'));
});

app.listen(PORT, () => {
  console.log(`YuiAnon corriendo en http://localhost:${PORT}`);
});
