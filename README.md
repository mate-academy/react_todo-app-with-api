# React To-Do App
A simple and efficient To-Do List app built with React and TypeScript to help you organize tasks effortlessly.

Features
- Add, edit, and delete tasks
- Mark tasks as completed
- Filter tasks (All, Active, Completed)
- Responsive design for a seamless experience on any device
- TypeScript for better code safety and maintainability


> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

## Toggling a todo status

Toggle the `completed` status on `TodoStatus` change:
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- covered the todo with a loader overlay while waiting for API response;
- the status should be changed on success;
- show the `Unable to update a todo` notification in case of API error.

Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- `toggleAll` button should have `active` class only if all the todos are completed;
- `toggleAll` click changes its status to the opposite one, and sets this new status to all the todos;
- it should work the same as several individual updates of the todos which statuses were actually changed;
- don't send requests for the todos that were not changed;

## Renaming a todo

Implement the ability to edit a todo title on double click:

- show the edit form instead of the title and remove button;
- saves changes on the form submit (just press `Enter`);
- save changes when the field loses focus (`onBlur`);
- if the new title is the same as the old one just cancel editing;
- cancel editing on `Esс` key `keyup` event;
- if the new title is empty delete the todo the same way the `x` button does it;
- if the title was changed show the loader while waiting for the API response;
- update the todo title on success;
- show `Unable to update a todo` in case of API error;
- or the deletion error message if we tried to delete the todo.

## If you want to enable tests
- open `cypress/integration/page.spec.js`
- replace `describe.skip` with `describe` for the root `describe`

> ❗❗All tests should pass, even if some behaviour is not well explained in the task❗❗

## Instructions

- [DEMO LINK](https://hrebinets.github.io/react_todo-app-with-api/)
