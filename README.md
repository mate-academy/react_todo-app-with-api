# Todo App

A todo list app that syncs with a REST API: add, complete, rename and delete todos, filter by status, and see inline loading and error states.

## Live demo

- [Demo](https://proninamariia.github.io/react_todo-app-with-api/)

## Technologies used

- React + TypeScript
- Sass (SCSS)
- Bulma
- Font Awesome
- Vite

## Core features

- Load todos for a user from the API on page load
- Add a new todo with the input field
- Toggle a single todo, or all todos at once, between active and completed
- Rename a todo on double click; cancel with `Esc`, save on blur or `Enter`
- Delete a todo, with a loading overlay while the request is in progress
- Filter the list by All / Active / Completed
- Error notifications for failed requests, auto-dismissed after a delay

## Setup instructions

```bash
npm install
npm start       # local dev server
npm run build   # production build
npm run deploy  # deploy to GitHub Pages
```
