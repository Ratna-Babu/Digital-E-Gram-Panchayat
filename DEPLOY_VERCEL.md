## Deploying Digital-E-Gram-Panchayat to Vercel

This document explains the minimal steps to deploy this Create React App (CRA) project to Vercel and configure environment variables for Firebase.

1. Project settings on Vercel

- Create a new Vercel project and import the repository (GitHub/GitLab/Bitbucket). Vercel will detect React and build using `npm run build` by default.

2. Build & Output

- The app uses a static build output in the `build/` folder (CRA). `vercel.json` in the repo instructs Vercel to run the static build and route all requests to `index.html` so client-side routing works.

3. Environment variables (required)

Add the following environment variables in the Vercel Project Settings (Environment Variables). Use the values from your Firebase project. Do NOT commit production secrets directly to the repo.

- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID

Set them for the appropriate environments (Preview and Production) in Vercel.

4. SPA routing

- `vercel.json` includes a route that forwards all requests to `/index.html`. This ensures client-side routes (React Router) work when reloading or navigating directly to nested routes.

5. Local verification

- Run locally to verify production build:

```powershell
npm install; npm run build
npx serve -s build
```

(`serve` is optional — you can install it globally with `npm i -g serve` or use any static server.)

6. Notes & next steps

- If you prefer to keep env variables in repo for a staging environment, create a `.env.production` template without real secrets and add it to `.gitignore`. The recommended approach is to use the Vercel Dashboard secrets.
- If you want additional redirects or API rewrites, update `vercel.json` accordingly.
