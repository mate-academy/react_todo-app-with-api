# React Todo App with API

A modern, responsive Todo application built with React and TypeScript. This project demonstrates CRUD operations, data persistence via a REST API, and efficient state management. It features a clean, user-friendly interface for managing tasks, including filtering, toggling completion, and editing todos.

## Features

- **Full CRUD Functionality**: Create, Read, Update, and Delete todos seamlessly.
- **Task Management**:
    - **Add**: Quickly add new tasks.
    - **Edit**: Double-click to rename existing tasks.
    - **Toggle**: Mark tasks as completed or active.
    - **Delete**: Remove tasks individually or clear all completed tasks.
    - **Toggle All**: Batch update all tasks to completed or active.
- **Filtering**: View all, active, or completed tasks.
- **Data Persistence**: All changes are synced with a backend API (using [Mate Academy API](https://mate-academy.github.io/react_todo-app-with-api/)).
- **Error Handling**: Graceful error messages for failed API requests.
- **Loading States**: Visual feedback (loaders) during async operations.
- **Optimistic UI**: Immediate UI updates for better user experience while syncing with the server.

## Technologies Used

- **Frontend**: React (Hooks, Functional Components), TypeScript
- **Styling**: Bulma CSS Framework, SASS/SCSS, Classnames utility
- **Animation**: React Transition Group
- **Build Tool**: Vite
- **Code Quality**: ESLint (Airbnb config), Prettier, Stylelint

## Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Start-Code-training/react_todo-app-with-api.git
    cd react_todo-app-with-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run start
    # or
    yarn start
    ```
    The app will open in your browser at `http://localhost:5173` (or another available port).

## Running Tests

This project includes Cypress tests to ensure functionality.

```bash
npm run test
# or to open Cypress UI
npx cypress open
```

## Demo

[Live Demo](https://dimononon.github.io/react_todo-app-with-api/)
