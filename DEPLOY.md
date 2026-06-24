# 🚀 Crear y publicar Tianguis Digital MX

Guía paso a paso para dejar el tianguis vivo en **GitHub → Vercel → Firebase**.
Tiempo estimado: ~20 minutos. No necesitas tocar el código.

> El diseño es tolerante a fallos: **el primer deploy ya carga el tianguis con
> datos de ejemplo aunque Firebase no esté configurado.** Cuando agregues las
> llaves de Firebase, se enciende con base de datos real, login y fotos.

---

## Paso 1 · Subir el código a GitHub

Abre una terminal **en la carpeta del proyecto** (`tianguis`) y corre:

```bash
git init
git add .
git commit -m "Tianguis Digital MX — MVP inicial"
git branch -M main
```

Crea un repo vacío en GitHub (sin README): https://github.com/new
Nómbralo `tianguis`. Luego conecta y sube (cambia TU-USUARIO):

```bash
git remote add origin https://github.com/TU-USUARIO/tianguis.git
git push -u origin main
```

---

## Paso 2 · Desplegar en Vercel (carga ya, con datos de ejemplo)

1. Entra a https://vercel.com/new
2. **Import** el repo `tianguis` que acabas de subir.
3. Framework: **Next.js** (se detecta solo). No cambies nada.
4. Clic en **Deploy**.

En ~1 minuto tendrás una URL tipo `https://tianguis-xxxx.vercel.app` con el
tianguis funcionando (contador en vivo, mercado, productos de ejemplo).

> Cada `git push` a `main` vuelve a desplegar automáticamente.

---

## Paso 3 · Crear el proyecto de Firebase

1. Entra a https://console.firebase.google.com → **Agregar proyecto**.
   Nómbralo `tianguis` (puedes desactivar Analytics).
2. Dentro del proyecto, crea una **App Web** (ícono `</>`).
   Copia el objeto `firebaseConfig` que te muestra.
3. Activa los servicios:
   - **Build → Authentication → Comenzar** → habilita **Correo/contraseña** y **Google**.
   - **Build → Firestore Database → Crear** (modo producción, región `nam5` o cercana).
   - **Build → Storage → Comenzar**.

---

## Paso 4 · Conectar las llaves de Firebase

### En local (para `npm run dev`)
Copia `.env.local.example` a `.env.local` y pega los valores del `firebaseConfig`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tianguis-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tianguis-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tianguis-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

### En Vercel (para producción)
Project → **Settings → Environment Variables** → agrega esas mismas 6 variables
(Production + Preview) → **Redeploy** el último deployment.

---

## Paso 5 · Reglas de seguridad

En la consola de Firebase pega el contenido de estos archivos del repo:

- `firestore.rules` → Firestore Database → pestaña **Reglas** → Publicar.
- `storage.rules` → Storage → pestaña **Reglas** → Publicar.

Así el catálogo es de lectura pública y solo el dueño autenticado edita lo suyo.

---

## Paso 6 · Sembrar datos de ejemplo en Firestore (opcional)

Para que la base ya tenga los 12 productos y 3 puestos de ejemplo:

1. Temporalmente, en Firestore → Reglas, pon `allow read, write: if true;` y Publica.
2. Con `.env.local` lleno, corre:
   ```bash
   npm run seed
   ```
3. **Vuelve a publicar las reglas seguras** (`firestore.rules`).

A partir de aquí, cualquiera puede registrarse, abrir su puesto y subir productos
con foto (que se guardan en Firestore + Storage).

---

## Checklist

- [ ] Repo en GitHub
- [ ] Deploy en Vercel (URL viva)
- [ ] Proyecto Firebase con Auth + Firestore + Storage
- [ ] 6 variables de entorno en Vercel
- [ ] Reglas de Firestore y Storage publicadas
- [ ] (Opcional) `npm run seed`
