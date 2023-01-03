# React Todo App with API

This is a todo app built with React that allows you to toggle and rename todos.

## Features

- Toggle the `completed` status of individual todos
  - A loader overlay is displayed while waiting for the API response
  - The status is changed on success
  - An error notification is shown in case of an API error
- Toggle the `completed` status of all todos with the `toggleAll` checkbox
  - The `toggleAll` button has the `active` class only if all todos are completed
  - Clicking on `toggleAll` changes its status and the status of all todos
  - Requests are only sent for todos whose statuses were actually changed
- Rename a todo title
  - The `TodoTitleField` is shown instead of the `TodoTitle` and `TodoDeleteButton`
  - Changes are saved on form submit (pressing `Enter`) or when the field loses focus (`onBlur`)
  - Editing is cancelled on `Esc` key `keydown` or if the new title is the same as the old one
  - If the new title is empty, the todo is deleted the same way the `x` button does it
  - A loader is shown while waiting for the API response
  - The todo title is updated on success
  - An error notification is shown in case of an API error or if the todo deletion failed

## Instructions

To use this app, follow these steps:

1. Clone the repository: `git clone https://github.com/alextsimba/react_todo-app-with-api`
2. Navigate to the project directory: `cd react_todo-app-with-api`
3. Install the dependencies: `npm install`
4. Run the app: `npm start`

The app will open in a new browser window.

## Testing

To run the test suite, use the following command:

`npm test`

## Deployment

To deploy the app, use the following commands:

1. Build the app for production: `npm run build`
2. Navigate to the `build` directory: `cd build`
3. Install the `gh-pages` package: `npm install gh-pages`
4. Run the `deploy` script: `npm run deploy`

The app will be deployed to GitHub Pages and available at `https://<your_username>.github.io/react_todo-app-with-api/`.
