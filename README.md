# React Todo App with API (complete)

It is the third part of the React Todo App with API.

Take your code implemented for [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
and implement the ability to toggle and rename todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

## Toggling a todo status

Toggle the `completed` status on `TodoStatus` change:
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save. -ok
- covered the todo with a loader overlay while waiting for API response; -ok
- the status should be changed on success; -ok
- show the `Unable to update a todo` notification in case of API error. -ok

Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- `toggleAll` button should have `active` class only if all the todos are completed; -ok
- `toggleAll` click changes its status to the opposite one, and sets this new status to all the todos; -ok
- it should work the same as several individual updates of the todos which statuses were actually changed; -ok
- do send requests for the todos that were not changed; ok


## Renaming a todo

Implement the ability to edit a todo title on double click:

- show the edit form instead of the title and remove button; -ok
- saves changes on the form submit (just press `Enter`); -ok
- save changes when the field loses focus (`onBlur`); -ok
- if the new title is the same as the old one just cancel editing; -ok
- cancel editing on `Esс` key `keyup` event; -ok
- if the new title is empty delete the todo the same way the `x` button does it; -ok
- if the title was changed show the loader while waiting for the API response; -ok
- update the todo title on success; -ok
- show `Unable to update a todo` in case of API error; -ok
- or the deletion error message if we tried to delete the todo. -ok

## If you want to enable tests
- open `cypress/integration/page.spec.js`
- replace `describe.skip` with `describe` for the root `describe`

> ❗❗All tests should pass, even if some behaviour in not well explained in the task❗❗

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_todo-app-with-api/) and add it to the PR description.
