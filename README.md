# React Todo App with API

This project is an advanced version of the "React ToDo App", now enhanced with full API integration for managing tasks remotely. It is built using React with TypeScript and follows clean architecture practices with a focus on interactivity, usability, and real-time API synchronization.

> [LIVE DEMO](https://mateuszcieplak.github.io/react_todo-app-with-api/).

![todoapp](./description/todoapp.gif)

## Tech Stack

- **React (with hooks)**
- **TypeScript**
- **CSS Modules**
- **REST API Integration**
- **Prettier + ESLint**

## Features

### 🧠 Core Functionality

- **Create, edit, delete, and filter tasks**
- **Mark tasks as completed/incomplete**
- **Toggle all tasks' status**
- **Persistent state via API**
- **Inline editing with full keyboard support**

### 🌐 API Integration

- **Add/Delete Todos**
  Based on the work from [react_todo-app-add-and-delete](https://github.com/mate-academy/react_todo-app-add-and-delete).

- **Toggle Todo Status**

  - Task status changes only on successful API response
  - Displays loading indicator while updating
  - Error notifications for failed updates

- **Rename Todo Titles**

  - Double-click to enable inline editing
  - Save changes on "Enter" key or when the input loses focus
  - Cancel editing with "Escape" or if no changes were made
  - Delete todo if new title is empty
  - Show loader while waiting for API response
  - Show appropriate error messages on failure

  ![todoedit](./description/edittodo.gif)

- **Toggle All Todos**
  - Toggle all items' status at once
  - Only send requests for items that were actually changed
  - "Toggle All" button reflects current global status

### 💡 UX Enhancements

- Loading overlays on individual todos
- Error messages for failed operations
- Prettier formatting with VSCode settings for auto-format on save

### ⚙️ State Management

- Uses **React Context API** for global state

---

## 🚀 Getting Started

```bash
git clone https://github.com/MateuszCieplak/react_todo-app-with-api
cd react_todo-app-with-api
npm install
npm start

```
