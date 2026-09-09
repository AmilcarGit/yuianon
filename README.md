# YuiAnon

Página donde alguien escribe un mensaje (ej. "Holi"), genera un enlace único, lo comparte, y cualquiera que abra ese enlace puede responder de forma anónima sin registrarse.

## 1. Subir a GitHub

Desde tu computadora (o desde el mismo Termux):

```
git init
git add .
git commit -m "YuiAnon"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/yuianon.git
git push -u origin main
```

## 2. Instalar en Termux

```
pkg update -y
pkg install -y nodejs git
git clone https://github.com/TU_USUARIO/yuianon.git
cd yuianon
npm install
```

## 3. Levantar el servidor

```
node server.js
```

Esto lo deja corriendo en `http://localhost:3000`, pero eso **solo tú lo ves** dentro de tu teléfono. Para el enlace público que cualquiera pueda abrir, necesitas un túnel. La forma más simple y gratis dentro de Termux es `localtunnel` (es JavaScript puro, no necesita compilar nada, por eso funciona bien en Termux):

Abre **otra sesión de Termux** (desliza desde el borde izquierdo → "Nueva sesión") y corre:

```
npx localtunnel --port 3000
```

Te va a dar algo como:

```
your url is: https://curly-otters-fry.loca.lt
```

Ese es el enlace público. Compártelo (o compártelo ya con `/hilo/xxxx` cuando alguien cree un mensaje). La primera vez que alguien lo abra, `loca.lt` les va a pedir que confirmen una página intermedia (solo la primera vez) — es normal, es la protección propia de localtunnel.

Si quieres intentar un subdominio fijo (no siempre está disponible):

```
npx localtunnel --port 3000 --subdomain yuianon
```

## 4. Dejarlo corriendo aunque cierres Termux

```
pkg install -y tmux
tmux new -s yuianon
node server.js
```

Luego `Ctrl + B` y después `D` para salir sin cerrar el proceso. Para volver a entrar: `tmux attach -t yuianon`.

## Notas

- Los mensajes se guardan en `db.json` dentro de la carpeta del proyecto (no se sube a GitHub, está en `.gitignore`).
- No hay usuarios ni contraseñas: cualquiera con el enlace puede leer y responder.
- Si cierras la sesión de `localtunnel` o apagas el teléfono, el enlace deja de funcionar hasta que lo vuelvas a levantar (la URL de `loca.lt` normalmente cambia cada vez que lo reinicias, a menos que uses `--subdomain`).
