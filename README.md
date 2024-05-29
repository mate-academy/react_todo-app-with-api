# React Todo App with API

## Introduction

Welcome to the **React Todo App with API** – an efficient, user-friendly, and highly functional task management application designed to simplify your daily task tracking. This app not only lets you add and delete todos but also provides the ability to toggle their completion status and rename them seamlessly, enhancing your productivity and task management experience.

[Demo Link](https://tetlisna.github.io/react_todo-app-with-api/)

## Why You'll Love It

### Real-Time Updates
The app interacts with an API to ensure that your data is always up-to-date. When you toggle a todo's status or rename it, the changes are immediately reflected, giving you a smooth and responsive experience.

### Optimized Performance
- **Loader Overlays**: While waiting for API responses, the app displays loader overlays, keeping you informed about the background processes and ensuring that you always know the current state of your actions.
- **Context Management**: All data is stored in the context, making state management efficient and the application performant.

### Comprehensive Todo Management
- **Toggling Todos**: Easily toggle the completion status of individual todos or all todos at once using the `toggleAll` checkbox. The `toggleAll` button activates only if all todos are marked as completed, ensuring precise control over your task list.
- **Renaming Todos**: Edit todo titles with a simple double-click. The intuitive editing form allows you to save changes on submit or when the input field loses focus. It also handles edge cases like empty titles or unchanged titles gracefully.

### Error Handling
- **User Notifications**: In case of any API errors, the app provides clear notifications such as `Unable to update a todo` or deletion error messages, keeping you informed and reducing confusion.

## Key Features

### Toggle Todo Status
- **Individual Toggle**: Toggle the `completed` status of each todo with instant feedback.
- **Bulk Toggle**: Use the `toggleAll` checkbox to change the status of all todos simultaneously. The app ensures that only the todos with actual status changes trigger API requests, optimizing performance.

### Rename Todos
- **Inline Editing**: Double-click a todo title to switch to edit mode. Changes are saved on `Enter` or when the input field loses focus.
- **Smart Handling**: If the new title is the same as the old one, editing is canceled. If the title is empty, the todo is deleted automatically, streamlining your workflow.
- **Error Feedback**: The app shows loaders during API calls and provides error messages if updates fail.

## Development and Testing

### Development
This app is built with modern React and TypeScript, ensuring a robust and type-safe development experience. Here are some of the key dependencies used in the project:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Bulma**: A modern CSS framework based on Flexbox.
- **Cypress**: A testing framework for end-to-end testing.

### Scripts

Start the development server

```bash
npm start 


### Testing
To run tests, you can use the following command:

```bash
npm test
