# Fit Track Week

Fit Track Week e una web app React JSX per organizzare allenamento e alimentazione su base settimanale.
Il backend usa Supabase (Auth + Postgres) con fallback in anteprima locale quando le env non sono configurate.

## Funzionalita MVP

- Login Google con Supabase Auth
- Login email con magic link Supabase
- Dashboard privata con due pannelli complanari: Allenamento e Alimentazione
- Sette tab settimanali in ogni pannello, da lunedi a domenica
- CRUD voci giornaliere su tabella `entries` (o localStorage in preview)

## Stack

- React 19 + Vite
- React Router
- Supabase Auth + Postgres
- Netlify Hosting (free tier)

## Setup locale

1. Installa dipendenze:
   - `npm install`
2. Copia `.env.example` in `.env`
3. Compila variabili Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Imposta anche:
   - `VITE_PUBLIC_APP_URL=http://localhost:5173`
5. Avvia app:
   - `npm run dev`

Se mancano le env Supabase, l'app resta usabile in modalita anteprima locale.

## Configurazione Supabase

1. Crea un progetto Supabase in regione UE
2. Esegui SQL da `supabase/schema.sql`
3. In `Authentication > Providers` abilita:
   - `Google`
   - `Email`
4. In `Authentication > URL Configuration` imposta:
   - `Site URL`: `http://localhost:5173` (in locale)
   - `Redirect URLs`: `http://localhost:5173/dashboard`

## Configurazione Google OAuth

1. Google Cloud Console > OAuth client (Web application)
2. Authorized JavaScript origins:
   - `http://localhost:5173`
   - dominio Netlify in produzione
3. Authorized redirect URI:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copia Client ID e Client Secret in Supabase provider Google

## Deploy gratuito su Netlify

### Opzione A: da GitHub

1. Push del progetto su GitHub
2. Netlify > Add new site > Import from Git
3. Seleziona repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Aggiungi env vars su Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_APP_URL=https://tuo-sito.netlify.app`
6. Deploy

### Opzione B: Netlify CLI

1. Installa CLI:
   - `npm install -g netlify-cli`
2. Login:
   - `netlify login`
3. Build:
   - `npm run build`
4. Deploy:
   - `netlify deploy --prod`

Il file `netlify.toml` e gia configurato per SPA routing React.

## Post-deploy (produzione)

1. In Supabase `Site URL`:
   - `https://tuo-sito.netlify.app`
2. In Supabase `Redirect URLs` aggiungi:
   - `https://tuo-sito.netlify.app/dashboard`
   - `http://localhost:5173/dashboard`
3. In Google OAuth aggiungi dominio Netlify negli origins

## Test end to end

1. Test login Google
2. Test login email magic link
3. Verifica redirect su dashboard
4. Verifica logout e ritorno su login
5. Verifica che ogni utente veda solo i propri record
