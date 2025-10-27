# cdf-tournament-manager

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deploy to GitHub Pages

```bash
# 1. Commit your changes
git add .
git commit -m "Your update message"
git push

# 2. Redeploy to GitHub Pages
npm run deploy
```
# TOURNAMENT SEEDING RULES 

## 1. Placement point (Primary ranking)

1st place in a game = 5 points
2nd place in a game = 3 points
3rd place in a game = 2 points
4th place in a game = 1 point

Your total placement points determine your rank.

## 2. TIEBREAKER (Equal placement points)

We add up your actual game scores from all rounds
  Example: If you scored 78, 84, and 76 in three games,
  your tiebreaker is 238 points
  Higher total game score = higher rank

## 3. PAIRING FOR NEXT ROUND

Players are grouped by similar placement points
Top performers play against each other
This ensures competitive, balanced games

## 4. EXAMPLE 

1. Player A - 15 pts (238) ← 3 first places, 238 total score
2. Player B - 15 pts (220) ← 3 first places, 220 total score
3. Player C - 13 pts (245) ← 2 firsts + 1 second

