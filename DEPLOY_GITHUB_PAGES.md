# 🚀 Deploy to GitHub Pages - Step by Step

## 📋 Prerequisites

1. GitHub account
2. Git installed on your computer
3. Your project ready to deploy

## 🔧 Setup Steps

### 1. Install gh-pages Package

```bash
npm install -D gh-pages
```

### 2. Update vite.config.js

✅ **Already done!** The base path is set to `/cdf-tournament-manager/`

**Important:** Change this to match your GitHub repository name:
```javascript
base: '/YOUR-REPO-NAME/'
```

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `cdf-tournament-manager` (or your preferred name)
3. Make it **Public**
4. Don't initialize with README (we already have code)
5. Click "Create repository"

### 4. Initialize Git and Push

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vue.js tournament manager"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/cdf-tournament-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
- Build your app
- Create a `gh-pages` branch
- Push the built files to GitHub Pages

### 6. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** (left sidebar)
4. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### 7. Access Your App

After 1-2 minutes, your app will be live at:

```
https://YOUR-USERNAME.github.io/cdf-tournament-manager/
```

## 📱 Update QR Code URL

Update the QR code in `src/views/Registration.vue` (line 82):

```javascript
const scorecardUrl = 'https://YOUR-USERNAME.github.io/cdf-tournament-manager/scorecard'
```

Then redeploy:
```bash
npm run deploy
```

## 🎯 Usage Scenarios

### Scenario 1: Admin Panel Local, Scorecard Public

**Admin (You):**
- Run locally: `npm run dev`
- Access at: `http://localhost:5173/admin`
- Manage players and games

**Players (Public):**
- Access scorecard at: `https://YOUR-USERNAME.github.io/cdf-tournament-manager/scorecard`
- Select their game
- Enter scores

### Scenario 2: Everything Public

Deploy everything and access from anywhere:
- Registration: `https://YOUR-USERNAME.github.io/cdf-tournament-manager/`
- Admin: `https://YOUR-USERNAME.github.io/cdf-tournament-manager/admin`
- Scorecard: `https://YOUR-USERNAME.github.io/cdf-tournament-manager/scorecard`

## 🔄 Update Your Deployed App

Whenever you make changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Your update message"
git push

# 2. Redeploy to GitHub Pages
npm run deploy
```

## 🌐 Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file in the `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS in your domain provider:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `YOUR-USERNAME.github.io`

3. In GitHub Settings > Pages, add your custom domain

## 📊 JSONBin Database

✅ **No changes needed!** Your JSONBin database works from anywhere:
- Same API URL
- Same API key
- Works locally AND on GitHub Pages

## 🎮 Complete Workflow Example

### Initial Setup:
```bash
# Install deployment package
npm install -D gh-pages

# Create GitHub repo and push
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/cdf-tournament-manager.git
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

### Daily Use:

**Before Tournament:**
1. Run admin panel locally: `npm run dev`
2. Register players at `http://localhost:5173/`
3. Assign players to games in admin panel
4. Share scorecard URL with players: `https://YOUR-USERNAME.github.io/cdf-tournament-manager/scorecard`

**During Tournament:**
- Players access scorecard via QR code or URL
- They select their game and enter scores
- You view results in admin panel (local or deployed)

**After Changes:**
```bash
git add .
git commit -m "Updated features"
git push
npm run deploy
```

## 🔍 Troubleshooting

### Page shows 404
- Wait 2-3 minutes after deployment
- Check GitHub Pages settings
- Verify `base` path in `vite.config.js` matches repo name

### Blank page
- Check browser console for errors
- Verify all routes use correct base path
- Clear browser cache

### QR Code not working
- Update URL in `Registration.vue`
- Redeploy: `npm run deploy`

### Changes not showing
- Clear browser cache (Ctrl+Shift+R)
- Wait a few minutes for GitHub Pages to update
- Check if deployment succeeded: `git log gh-pages`

## 📝 Quick Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy

# Check deployment status
git log gh-pages
```

## ✅ Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] gh-pages package installed
- [ ] vite.config.js base path updated
- [ ] Deployed with `npm run deploy`
- [ ] GitHub Pages enabled in settings
- [ ] App accessible at GitHub Pages URL
- [ ] QR code URL updated
- [ ] Tested scorecard page from phone

---

**Your tournament manager is now live! 🎉**

Players can access the scorecard from anywhere, while you manage everything from your local admin panel or the deployed version.
