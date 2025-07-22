# React Todo App with API (Complete Version)

This is the third part of the React Todo App project — enhanced with full CRUD functionality, integration with an API, and user interaction improvements.

## 🚀 Features

- ✅ Add and delete todos via API
- 🔁 Toggle individual todo status with loader and error handling
- ✅ Toggle all todos via `toggleAll` checkbox (with smart update logic)
- ✏️ Rename todos with full editing UX:
  - Edit on double click
  - Save on `Enter` or `onBlur`
  - Cancel on `Esc`
  - Delete on empty title
  - Loader during request, error notifications

## 🛠️ Tech Stack

- React
- TypeScript
- SCSS
- Prettier
- REST API
- Cypress (for testing)

## 🔄 Toggling a Todo

- Loader overlay appears while waiting for API response
- Status updates on **success**
- Error notification on **failure**
- `toggleAll`:
  - Activates only if all todos are completed
  - Sends requests only for todos that need updating

## ✏️ Renaming a Todo

- Double-click to enter edit mode
- Save on `Enter` or when input loses focus
- Cancel on `Esc`
- If title is empty → delete the todo
- Loader shown during request
- Notifications shown in case of errors


  [DEMO LINK](https://OksanaKuziv.github.io/react_todo-app-with-api/)
  
