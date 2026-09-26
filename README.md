# Bizz Spot — Local Business Directory

A directory site where local businesses can be listed and browsed. Built with plain HTML/CSS/JS + jQuery + Bootstrap on the frontend, and Express + Supabase (Postgres) on the backend.

## Project structure

```
business-directory/
├── client/              # Frontend (Home, Directory, Submit pages)
│   ├── index.html
│   ├── directory.html
│   ├── submit.html
│   ├── css/style.css
│   └── js/               # config.js, theme.js, home.js, directory.js, submit.js
├── server/              # Backend
│   ├── server.js          # run this locally with: node server.js
│   ├── netlify/functions/api.js   # same backend, packaged for Netlify's serverless deploy
│   ├── package.json
│   ├── .env.example        # copy to .env and fill in your own Supabase values
│   └── .gitignore
└── netlify.toml          # tells Netlify how to build/deploy both client + server together
```

## Running it locally

1. In `server/`, copy `.env.example` to a new file named `.env`, and fill in your real Supabase project URL and key.
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Start the backend:
   ```
   node server.js
   ```
   You should see `Server running on port 5000`.
4. Open `client/index.html` in your browser directly, or use the VS Code "Live Server" extension for a smoother experience.

The frontend automatically talks to `http://localhost:5000` when running locally (see `client/js/config.js`), and switches to same-domain requests once deployed.

## Deploying (single deploy, one URL)

This project deploys entirely on **Netlify** — both the static frontend and the backend (as a Netlify Function), so you get one live URL instead of juggling two services.

1. Push this project to GitHub.
2. On [netlify.com](https://netlify.com), choose **Add new site → Import an existing project**, and connect your GitHub repo.
3. Netlify reads `netlify.toml` automatically — no manual build settings needed.
4. Before deploying, add these **environment variables** in the Netlify site settings:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
5. Click **Deploy site**.

Once live, the frontend and the `/api/*` routes both work from the same Netlify URL.
