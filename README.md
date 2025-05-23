# React Todo App with API (complete)

It is the third part of the React Todo App with API.

Take your code implemented for [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
and implement the ability to toggle and rename todos.

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

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://ralfendeck25.github.io/react_todo-app-with-api/) and add it to the PR description.
