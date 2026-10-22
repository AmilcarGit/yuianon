# YuiAnon

**YuiAnon** es una pequeña aplicación web para crear un hilo de mensajes y compartir un enlace. Las personas que abran el enlace pueden leer el hilo y responder de forma anónima, sin crear una cuenta.

<p>
  <a href="https://github.com/AmilcarGit/yuianon"><img src="https://img.shields.io/badge/GitHub-Código%20fuente-181717?style=flat-square&logo=github" alt="Código fuente"></a>
  <a href="https://github.com/AmilcarGit/yuianon/issues"><img src="https://img.shields.io/badge/Soporte-Issues-8957e5?style=flat-square&logo=github" alt="Soporte"></a>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js y Express">
</p>

## ✨ Características

- Crear un hilo a partir de un mensaje inicial.
- Generar un enlace compartible para abrir el hilo.
- Permitir respuestas anónimas sin registro.
- Guardar los hilos en un archivo local `db.json`.
- Limitar la frecuencia de creación y respuesta para reducir el spam.
- Limitar cada mensaje a 500 caracteres y cada hilo a 300 mensajes.
- Eliminar un hilo mediante la clave secreta devuelta al crearlo.

## 📋 Requisitos

- Node.js y npm instalados.
- Git para clonar el repositorio.
- Un puerto disponible; por defecto, el servidor utiliza el puerto `3000`.

## 🚀 Instalación local

En Termux:

```bash
pkg update -y
pkg install -y nodejs git
git clone https://github.com/AmilcarGit/yuianon.git
cd yuianon
npm install
npm start
```

En una computadora con Node.js instalado, puedes usar los mismos comandos de Git y npm, sin los pasos de `pkg`.

Al iniciar, el servidor mostrará una dirección local como:

```text
http://localhost:3000
```

Abre esa dirección en el navegador del mismo dispositivo. Para cambiar el puerto, establece la variable de entorno `PORT` antes de iniciar el servidor.

## 🌐 Compartir un hilo

Para probarlo desde tu teléfono o computadora, el servidor debe seguir ejecutándose. Si usas Termux y quieres crear temporalmente una dirección pública para pruebas, abre otra sesión y ejecuta:

```bash
pkg install -y nodejs
npx localtunnel --port 3000
```

Localtunnel puede asignar una URL temporal que cambia al reiniciarse y puede mostrar una página intermedia. No es una garantía de alojamiento permanente. Para un enlace estable, despliega la aplicación en un servicio compatible con Node.js y asegúrate de que el almacenamiento de `db.json` sea persistente.

## 🔌 Rutas de la aplicación

| Método | Ruta | Función |
|---|---|---|
| `POST` | `/api/hilos` | Crear un hilo con el primer mensaje |
| `GET` | `/api/hilos/:id` | Consultar los mensajes de un hilo |
| `POST` | `/api/hilos/:id/responder` | Añadir una respuesta |
| `DELETE` | `/api/hilos/:id` | Eliminar un hilo usando la clave secreta |
| `GET` | `/hilo/:id` | Abrir la página compartible del hilo |

## 🗂️ Estructura principal

```text
yuianon/
├── server.js       # Servidor Express y rutas de la API
├── public/         # Interfaz web
├── package.json    # Dependencias y comando de inicio
├── .gitignore      # Excluye node_modules y db.json
└── README.md
```

El archivo `db.json` se crea localmente cuando se guardan mensajes y está excluido de Git. Haz copias de seguridad de los datos si necesitas conservarlos.

## 🔐 Privacidad y seguridad

- Cualquier persona que tenga el enlace de un hilo puede leerlo y responder. **No compartas información privada o sensible.**
- El anonimato frente a otros usuarios no significa que un servicio de alojamiento o una red no pueda registrar metadatos de conexión.
- La limitación de peticiones es básica y se mantiene en la memoria del proceso; no sustituye una protección contra abuso a gran escala.
- Protege la clave secreta de eliminación del hilo y no la publiques.
- Antes de usarlo con público, revisa el almacenamiento, las copias de seguridad y las medidas de moderación adecuadas a tu despliegue.

## 🤝 Contribuir y reportar problemas

Las sugerencias y errores se pueden publicar en [Issues](https://github.com/AmilcarGit/yuianon/issues). También puedes explorar los [demás proyectos de AmilcarGit](https://github.com/AmilcarGit?tab=repositories).

---

Desarrollado por [AmilcarGit](https://github.com/AmilcarGit).
