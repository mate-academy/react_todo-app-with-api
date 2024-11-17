## Demo
- Link to Live Demo: [DEMO LINK](https://pikalovandrey.github.io/react_todo-app-with-api/)

# React Todo App with API

## Project Description
This project implements the ability to toggle and rename tasks in a React-based Todo application. It focuses on enhancing user interaction with tasks while building upon the previously established functionalities of adding and deleting todos.

## Achievements and Implemented Features

### Toggling Todos
- **Toggle Status**: Users can change the `completed` status of each todo item.
  - Added a loader overlay to indicate loading while waiting for the API response.
  - The todo status is updated upon successful API call.
  - Displays an error notification ("Unable to update a todo") in case of an API error.

- **Toggle All**: A checkbox that allows users to toggle the completion status of all todos simultaneously.
  - The checkbox has an `active` class only if all todos are completed.
  - Clicking the checkbox changes its status and updates all todos accordingly.
  - The API sends requests only for the todos whose statuses actually changed.

### Renaming Todos
- **Edit on Double Click**: Users can rename a todo by double-clicking on it.
  - An edit form appears in place of the title and remove button.
  - Changes are saved on form submission (by pressing `Enter`) or when the field loses focus (`onBlur`).
  - If the new title matches the old one, editing is canceled.
  - Pressing `Esc` cancels the editing process.
  - If the new title is empty, the todo is deleted in the same way as with the remove button.
  - A loader is displayed while waiting for the API response upon title change.
  - Updates the todo title on success, with error notifications for any issues.

## Technologies Used
- React
- TypeScript
- CSS (Sass)
- Axios for API calls

## Instructions
1. Clone the repository and navigate to the project directory.
2. Install dependencies using `npm install`.
3. Start the development server with `npm start`.
4. Open the application in your browser at `http://localhost:3000`.
