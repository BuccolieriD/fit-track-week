# Fit Track Week

Fit Track Week e una web app React JSX per organizzare allenamento e alimentazione con una dashboard settimanale. L'app e pensata per usare Supabase come backend gratuito per auth e database e Vercel come hosting gratuito.

## Funzionalita MVP

- Login con Google e accesso email (magic link) tramite Supabase
- Modalita anteprima locale se le variabili Supabase non sono ancora configurate
- Dashboard privata con due pannelli complanari: Allenamento e Alimentazione
- Sette tab settimanali per ciascuna categoria
- CRUD delle voci giornaliere con persistenza su Supabase oppure localStorage

## Stack

- React 19 + Vite
- React Router
- Supabase Auth + Postgres
- Vercel per il deploy frontend

## Setup locale

1. Installa le dipendenze con `npm install`
2. Copia `.env.example` in `.env`
3. Inserisci `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (oppure la tua publishable key)
4. Inserisci `VITE_PUBLIC_APP_URL`:
	- in locale: `http://localhost:5173`
	- in produzione: `https://tuo-progetto.vercel.app`
5. Avvia il progetto con `npm run dev`

Se non imposti le variabili ambiente, l'app resta navigabile in modalita anteprima locale per testare la UI e il flusso settimanale.

## Configurazione Supabase

1. Crea un progetto Supabase in regione UE
2. Esegui lo script in `supabase/schema.sql`
3. In Authentication abilita Google e Email
4. Aggiungi questi redirect URL:
	- `http://localhost:5173/dashboard`
	- URL Vercel di produzione
5. Inserisci URL e anon key nel file `.env`

### Abilitare Google e Email

1. Vai in `Authentication > Providers` nel progetto Supabase
2. Attiva `Google` e inserisci Client ID e Client Secret dal progetto Google Cloud
3. Verifica che il provider `Email` sia attivo (magic link)
4. In `Authentication > URL Configuration` imposta:
	- `Site URL`: `http://localhost:5173`
	- `Redirect URLs`: `http://localhost:5173/dashboard`
5. In Google Cloud configura URI di redirect autorizzato:
	- `https://oejncjstckzxtsikmklr.supabase.co/auth/v1/callback`

## Deploy su Vercel

1. Importa il repository su Vercel
2. Aggiungi le env vars `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Aggiungi anche `VITE_PUBLIC_APP_URL` con il dominio Vercel pubblico
4. Aggiorna i redirect provider in Supabase con l'URL di produzione
5. Esegui il deploy

### Config produzione consigliata

- Imposta in Supabase `Site URL` con il dominio Vercel pubblico
- Aggiungi Redirect URL di produzione:
	- `https://tuo-progetto.vercel.app/dashboard`
- Mantieni anche il redirect locale:
	- `http://localhost:5173/dashboard`
- In Google Cloud aggiungi JavaScript origin e redirect coerenti con il dominio Vercel

### Allineamento URL pubblico (Vercel + Supabase + Google)

Usa sempre lo stesso dominio pubblico, ad esempio `https://tuo-progetto.vercel.app`.

1. Nel progetto (`.env` locale):
	- `VITE_PUBLIC_APP_URL=https://tuo-progetto.vercel.app` per simulare redirect produzione
2. In Vercel (Project Settings > Environment Variables):
	- `VITE_PUBLIC_APP_URL=https://tuo-progetto.vercel.app`
3. In Supabase (Authentication > URL Configuration):
	- `Site URL`: `https://tuo-progetto.vercel.app`
	- `Redirect URLs`:
	  - `https://tuo-progetto.vercel.app/dashboard`
	  - `http://localhost:5173/dashboard`
4. In Google Cloud (OAuth client web):
	- `Authorized JavaScript origins`:
	  - `https://tuo-progetto.vercel.app`
	  - `http://localhost:5173`
	- `Authorized redirect URIs`:
	  - `https://oejncjstckzxtsikmklr.supabase.co/auth/v1/callback`

## Test end to end autenticazione

1. Avvia il progetto in locale con npm run dev
2. Apri la pagina login
3. Test Google:
	 - clicca Continua con Google
	 - completa consenso OAuth
	 - verifica redirect su dashboard
4. Test Email magic link:
	 - inserisci email valida
	 - clicca Continua con email
	 - apri il link ricevuto via email
	 - verifica redirect su dashboard
5. Verifica logout e ritorno su login
6. Verifica accesso diretto a dashboard senza sessione: deve riportare al login

## Note sul login Apple

Il login Apple non e incluso nel MVP perche non rispetta il vincolo di stack totalmente gratuita in ambito web. Per restare su un setup a costo zero, il progetto usa Google e accesso email.
