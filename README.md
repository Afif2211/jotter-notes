# Jotter — Notes App

A simple notes app that persists across page reloads using the browser's localStorage API, with a Three.js background of drifting translucent pages.

## Live Demo
https://jotter-notes-alpha.vercel.app/

## Features
- Add and delete notes
- Notes persist after a page refresh (saved to localStorage)
- Empty state when no notes exist
- Animated Three.js background — page shapes drift and scale roughly with note count
- Fully responsive layout

## Built with
- React (`useState`, `useEffect`)
- Three.js
- Browser localStorage API
- Plain CSS

## What I learned
This project introduced localStorage for persisting data across page reloads without a backend. The trickiest part was a race condition: on mount, one effect loads saved notes from localStorage, while another effect saves the current notes state back to localStorage whenever it changes. Because that second effect also runs on mount (before the loaded notes have been applied to state), it was silently overwriting saved notes with an empty array on every refresh. The fix was an `isLoaded` flag that blocks the save effect from running until the load effect has finished — a good reminder that multiple effects touching the same resource can race each other if you don't explicitly sequence them.

## Running locally
```bash
npm install
npm run dev
```
