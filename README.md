# Fit Track Week

Fit Track Week e una web app React JSX per organizzare allenamento e alimentazione su base settimanale.
Il backend ora usa Firebase (Auth + Firestore + Hosting), con fallback in anteprima locale quando le env non sono configurate.

## Funzionalita MVP

- Login Google con Firebase Authentication
- Login email con magic link Firebase Authentication
- Dashboard privata con due pannelli complanari: Allenamento e Alimentazione
- Sette tab settimanali in ogni pannello, da lunedi a domenica
- CRUD voci giornaliere su Firestore (o localStorage in preview)

## Stack

- React 19 + Vite
- React Router
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting (free tier)

## Setup locale

1. Installa dipendenze:
   - `npm install`
2. Copia `.env.example` in `.env`
3. Compila variabili Firebase web app:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Imposta anche:
   - `VITE_PUBLIC_APP_URL=http://localhost:5173`
5. Avvia l'app:
   - `npm run dev`

Se mancano le env Firebase, l'app resta usabile in modalita anteprima locale.

## Configurazione Firebase Console

1. Crea un progetto Firebase
2. Aggiungi Web App nel progetto e copia i parametri SDK
3. Authentication -> Sign-in method:
   - abilita `Google`
   - abilita `Email link (passwordless sign-in)`
4. Authentication -> Settings -> Authorized domains:
   - aggiungi `localhost`
   - aggiungi il dominio pubblico Firebase Hosting quando lo hai
5. Firestore Database:
   - crea database in modalita produzione
   - pubblica le regole da `firestore.rules`

## Deploy gratuito su Firebase Hosting

1. Installa Firebase CLI:
   - `npm install -g firebase-tools`
2. Login CLI:
   - `firebase login`
3. Inizializza progetto locale (se richiesto):
   - `firebase use --add`
4. Imposta `.firebaserc` con il tuo project id
5. Build app:
   - `npm run build`
6. Deploy:
   - `firebase deploy`

## URL pubblico e redirect

Quando hai il dominio hosting, aggiorna:

1. `.env` locale:
   - `VITE_PUBLIC_APP_URL=https://tuo-progetto.web.app`
2. Firebase Authentication -> Authorized domains:
   - `tuo-progetto.web.app`
   - `tuo-progetto.firebaseapp.com`
3. Firestore rules gia compatibili con autenticazione utente su `entries.user_id`

## Test end to end autenticazione

1. Test Google login da pagina login
2. Test Email magic link con una tua email
3. Verifica redirect su dashboard
4. Verifica logout e ritorno su login
5. Verifica che ogni utente veda solo i propri dati
