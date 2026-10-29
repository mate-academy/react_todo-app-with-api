# Todo App

A todo list app built with React and TypeScript that syncs every change with a REST API.

## Live Preview

[slysahex.github.io/react_todo-app-with-api](https://slysahex.github.io/react_todo-app-with-api/)

## Technologies Used

- React 18 (hooks)
- TypeScript
- REST API (fetch)
- Bulma, SCSS
- classnames, react-transition-group
- Cypress (tests)

## Features

- Load, add, delete and rename todos through the API
- Toggle a single todo or all todos at once
- Filter todos: All / Active / Completed
- Clear all completed todos
- Rename a todo on double click (Enter to save, Esc to cancel, empty title deletes it)
- Loader overlay on a todo while its request is in progress
- Error notifications when a request fails

## Getting Started

```bash
git clone https://github.com/slysahex/react_todo-app-with-api.git
cd react_todo-app-with-api
npm install
npm start
```
