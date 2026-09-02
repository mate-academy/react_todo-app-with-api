# React Todo App with API

A full-stack Todo application with a custom Node.js/Express backend, PostgreSQL database, and full deployment pipeline.

> 🔗 **Live demo:** https://react-todo-app-with-api-fu5w.vercel.app
> 🔗 **API example:** https://react-todo-app-with-api.onrender.com/todos

## Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Axios

**Backend**

- Node.js + Express
- Sequelize ORM
- PostgreSQL

**Infrastructure**

- Frontend deployed on [Vercel](https://vercel.com)
- Backend deployed on [Render](https://render.com)
- Database hosted on [Neon](https://neon.tech)

## Features

- Add, toggle, rename, and delete todos
- Toggle all todos as completed/active with a single click
- Bulk delete of completed todos
- Inline editing with keyboard shortcuts (`Enter` to save, `Esc` to cancel)
- Loading states and error notifications for all API interactions
- Data persisted in a PostgreSQL database — no data loss on refresh or server restart

## Architecture

The backend follows a layered architecture:
