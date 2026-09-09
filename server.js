const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const MAX_MENSAJES_POR_HILO = 300;

app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Anti-spam simple: máximo N peticiones por IP en una ventana de tiempo
const intentos = new Map();
function limitar(maxPeticiones, ventanaMs) {
  return (req, res, next) => {
    const ip = req.ip || 'desconocida';
    const ahora = Date.now();
    const lista = (intentos.get(ip) || []).filter(t => ahora - t < ventanaMs);
    if (lista.length >= maxPeticiones) {
      return res.status(429).json({ error: 'Estás enviando mensajes muy rápido, espera un momento.' });
    }
    lista.push(ahora);
    intentos.set(ip, lista);
    next();
  };
}

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
app.post('/api/hilos', limitar(6, 60000), (req, res) => {
  const mensaje = limpiar(req.body.mensaje);
  if (!mensaje) return res.status(400).json({ error: 'Mensaje vacío' });

  const db = leerDB();
  const id = crypto.randomBytes(4).toString('hex');
  const clave = crypto.randomBytes(4).toString('hex');
  db[id] = {
    creado: Date.now(),
    clave,
    mensajes: [{ texto: mensaje, fecha: Date.now() }]
  };
  guardarDB(db);
  res.json({ id, clave });
});

// Obtener un hilo y sus mensajes (sin exponer la clave de borrado)
app.get('/api/hilos/:id', (req, res) => {
  const db = leerDB();
  const hilo = db[req.params.id];
  if (!hilo) return res.status(404).json({ error: 'No encontrado' });
  res.json({ creado: hilo.creado, mensajes: hilo.mensajes });
});

// Responder anónimamente a un hilo
app.post('/api/hilos/:id/responder', limitar(10, 60000), (req, res) => {
  const mensaje = limpiar(req.body.mensaje);
  if (!mensaje) return res.status(400).json({ error: 'Mensaje vacío' });

  const db = leerDB();
  const hilo = db[req.params.id];
  if (!hilo) return res.status(404).json({ error: 'No encontrado' });

  if (hilo.mensajes.length >= MAX_MENSAJES_POR_HILO) {
    return res.status(403).json({ error: 'Este hilo alcanzó el límite de respuestas.' });
  }

  hilo.mensajes.push({ texto: mensaje, fecha: Date.now() });
  guardarDB(db);
  res.json({ ok: true, total: hilo.mensajes.length });
});

// Eliminar un hilo usando la clave secreta que se dio al crearlo
app.delete('/api/hilos/:id', (req, res) => {
  const clave = String(req.body.clave || '');
  const db = leerDB();
  const hilo = db[req.params.id];
  if (!hilo) return res.status(404).json({ error: 'No encontrado' });
  if (hilo.clave !== clave) return res.status(403).json({ error: 'Clave incorrecta' });

  delete db[req.params.id];
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