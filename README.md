# Vite + React JS + Tailwind + Github Pages: The Defacto Guide
## The Problem
If you've tried to set up a React project recently, you've likely hit a wall of version conflicts. Create React App is dead. Tailwind v4 changed the installation process entirely. And most "beginner" guides leave you with a deployment that causes too many problems.
This is my definitive, "Golden Path" to building a modern React app, styling it with Tailwind v4, and deploying it professionally via GitHub Actions. My go-to IDE is Visual Studio Code, so there may be things that need to be adapted for other environments. We'll cover this together in seven steps:
1. The Scaffolding
2. The Styling
3. The Secrets
4. The Sample Page
5. The Test
6. The Deployment
7. The Push

---

## Prerequisites
Most of this article involves settings in GitHub. You can save some time by setting up your repo before we begin. 
On your GitHub page, click the green "New" button (or go here).
Give it a name. For this article, we are just using "my-app".
Visibility can be public or private, you pick.
Click the green "Create repository" button.

This article also assumes the usage of VS Code. Of course you can use other IDEs, but there will be VS Code-specific actions here, along with regular Bash commands that you can run otherwise.

---

## Step 1: The Scaffolding (Vite)
We use Vite because it is well-maintained and easy to use. Open your terminal and run the following. Make sure to select "Yes" at the `Install with npm and start now?` prompt and we can skip `npm install`.
```
npm create vite@latest my-app -- --template react
```
---

## Step 2: The Styling (Tailwind v4)
Stop! Do not run npx tailwindcss init. Do not install postcss.
Tailwind v4 is now a native Vite plugin. This means zero configuration files.
Navigate to the project directory on your file system in your terminal instance and install the dependencies. You may need to stop the app.
```
npm install -D tailwindcss @tailwindcss/vite
```
Add the plugin: In VS Code, in the Explorer tab, on your app folder with the blue "Open Folder" button, then modify `vite.config.js` and add the import and plugin. Make sure you get everything inside the square brackets and watch that extra comma you'll need.
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- 1. Add Import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- 2. Add to array
  ],
})
```
Import the CSS: Open `src/index.css`. Delete everything and add this single line:
```
@import "tailwindcss";
```
That is it. No config files. No bloat.

---

## Step 3: The Secrets
This stack handles secrets differently than the old process.env way. Here is the rule: If it's not prefixed with `VITE_`, it doesn't exist.
### Local Development
1. Create a `.env` file in your root.
2. Add `.env` to your `.gitignore` immediately.
3. Add your keys using the required prefix:
```
VITE_APP_NAME="The Defacto Stack"
VITE_API_KEY="12345"
```
### GitHub Settings
Your local .env file is ignored by Git (for safety). This means GitHub has no idea what your API keys are until you manually teach it.
1. Go to Your Repo
    - Open your repository on GitHub. We'll be doing a few things while we're here.
2. Navigate to Secrets
    - Click Settings (top right tab).
    - Click Secrets and variables -> Actions.

3. Add the Repository Secret
    - Click the green New repository secret button.
    - Name: VITE_APP_NAME (Must match your local .env and workflow file exactly).
    - Secret: Paste your actual key/token here.
    - Click "Add secret".

4. Repeat
    - Do this for every variable in your local .env file that you want the production site to use.

**Crucial Note on Security:** Once you click "Add," you can never see that value again - only overwrite it. This is why it is safe; even you (or a hacker with your password) cannot read the keys back out of the UI.

**The GitHub Actions Bridge:** Here is the common mistake: Adding secrets to GitHub Settings is not enough. You must explicitly inject them into the build process in your workflow file, or the build server won't see them. You will see this setting in the .github/workflows/deploy.yml file we will create shortly.

**GitHub Pages:** While you are still in the Settings menu, we need to tell GitHub how to build the site.
1. Click the Settings tab.
2. On the left sidebar, click Pages (under "Code and automation").
3. Look for the Build and deployment section.
4. Change Source from "Deploy from a branch" to "GitHub Actions".

Why do this now? By setting this to "GitHub Actions" before you push your code, the deployment pipeline will be ready and waiting the moment your workflow file arrives.

---

## Step 4: The Sample Page
Let's prove it works. We'll build a component that tests:
- **Gradients** (Tailwind Check)
- **State** (React Check)
- **Environment Variables** (Secrets Check)

Replace src/App.jsx with this:

```
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const appName = import.meta.env.VITE_APP_NAME || "Vite + React";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
      {/* Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500 blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-violet-500 blur-3xl opacity-10 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-slate-800 rounded-lg mb-6 border border-slate-700">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-xs font-mono text-slate-400">SYSTEM ONLINE</span>
          </div>

          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            {appName}
          </h1>
          
          <p className="text-slate-400 mb-8 text-lg">
            Zero config. Maximum speed. <br/>
            <span className="text-sm opacity-50">Tailwind v4 + Vite + GitHub Actions</span>
          </p>

          <button 
            onClick={() => setCount(c => c + 1)}
            className="group w-full py-3 px-6 bg-white text-slate-950 font-bold rounded-lg transition-all hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Deployments Count: {count}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
```
---

## Step 5: The Test
Run npm run dev. You should see a beautiful, dark-mode card with glowing gradients.

---

## Step 6: The Deployment (GitHub Actions)
Here is where some old-timers will stumble. There is a new and fresh way to deploy your app. There are three things we will eliminate:
- ❌ npm run deploy
- ❌gh-pages
- ❌The "homepage" setting in package.json

Because we are using GitHub Actions, you never have to manually build your site again. You can delete the deploy script from your package.json if you added one.
Also, don't use the `gh-pages` npm package. It's manual and outdated. We use GitHub Actions to deploy automatically on every push.

**The Config Fix (Crucial):** GitHub Pages hosts your site at `/repo-name/`. You must tell Vite this. Update `vite.config.js`:
```
import tailwindcss from '@tailwindcss/vite'; 
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "/my-app/", // <--- MUST MATCH YOUR REPO NAME
})
```
You do not have to set the "homepage" value in package.json. This is old CRA code.

### The Workflow: Create `.github/workflows/deploy.yml`. Paste this in:

```
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          # --- SECRETS INJECTION ---
          # 1. You must define these keys in GitHub Repo Settings > Secrets
          # 2. They must start with VITE_ to be visible to the app
          VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
...
## Step 7: The Push (Two Options)
You have two options to push your code. Pick one.

### Option A: The VS Code Way (Recommended)
Stop typing commands! VS Code has a world-class Git integration built right in. We will publish to the repo that you have previously created above.
Open the "Source Control" tab. 

**Initialize**: Click the Source Control icon (left bar) -> Click "Initialize Repository". In the "Repositories" section, ensure that it shows "main".

**Commit**: Type "Initial Commit" and click the blue Commit button, but only click "Publish Branch" if you want to publish to a new repo. In this case, we have already created our repo, so don't click it.

**Add the Remote**: This can take 10 clicks in VS Code, or we can do it in a few lines in the terminal. Go grab your git path from your repo in GitHub. Since its a new repo, you should be presented with this immediately, or you can grab it from the green "Code" button on an existing repo.
```
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

You'll know that you have successfully set up git when you see something like this in the terminal:

```
PS D:\Repos\my-app> git push -u origin main
Enumerating objects: 21, done.
Counting objects: 100% (21/21), done.
Delta compression using up to 8 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (21/21), 33.69 KiB | 4.81 MiB/s, done.
Total 21 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/YOUR_USER/YOUR_REPO.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```
Now that you have all of this configured and working, you can simply update the application by:
1. Entering a "Message" or commit name.
2. Clicking the "Commit" button.
3. Clicking the "Sync Changes" button. Or, on the dropdown on the "Commit" button, pick "Commit and Sync".

This automatically handles the push, pull, and remote connection for you.

### Option B: The Terminal Way (Manual)
```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/my-app.git
git push -u origin main
```

Either way, if you hustle over to the "Actions" tab in your repo on GitHub, you should see the build action running. Green checkboxes are good, red Xs are failures. If you have a failure, click the workflow name that failed for an error log. Most of these problems you will find will be copy and paste errors, or you may have forgotten to enable GitHub Pages.

The GitHub Pages URL will be something like this:

https://YOUR_USER.github.io/my-app/

You can find this under Settings and then Pages, or on the main page of your repo, click the gear icon next to "About", check "Use your GitHub Pages website" and the URL will be revealed.
