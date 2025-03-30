
# Deploying to GitHub Pages

This document outlines the steps to deploy the Poker Tournament Timer application to GitHub Pages.

## Prerequisites

1. Make sure you have a GitHub account
2. Create a repository for this project (if you haven't already)
3. Ensure you have Git installed on your local machine

## Step-by-Step Deployment Process

### 1. Initialize Git and Connect to GitHub

If you haven't already connected your project to GitHub:

```bash
# Initialize Git repository (if not already done)
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit"

# Connect to your GitHub repository (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/poker-tournament-timer.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to GitHub Pages

The project is already configured for GitHub Pages deployment. You can deploy using:

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

This command will:
1. Build your application with the correct base path
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the built files to that branch
4. GitHub will automatically serve your site from this branch

### 3. Access Your Deployed Site

After deployment, your site will be available at:
`https://your-username.github.io/poker-tournament-timer/`

It may take a few minutes for GitHub to process and make your site available.

### 4. Future Updates

For future updates, simply:

1. Make your changes
2. Commit them to Git
3. Run `npm run deploy` again to update the deployed site

## Troubleshooting

- If your assets (like CSS or JS) are not loading, check that the base path in `vite.config.ts` matches your repository name.
- If you see a 404 error, ensure that GitHub Pages is enabled in your repository settings and is set to use the `gh-pages` branch.
- Check the "Actions" tab in your GitHub repository to see if there are any deployment issues.
