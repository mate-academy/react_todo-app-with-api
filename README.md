# React Todo App with API (complete)

It is the third part of the React Todo App with API.

Take your code implemented for [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
and implement the ability to toggle and rename todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

## Toggling a todo status

[x] Toggle the `completed` status on `TodoStatus` change:
- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- [x] covered the todo with a loader overlay while waiting for API response;
- [x] the status should be changed on success;
- [x] show the `Unable to update a todo` notification in case of API error.

[x] Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- [x] `toggleAll` button should have `active` class only if all the todos are completed;
- [x] `toggleAll` click changes its status to the opposite one, and sets this new status to all the todos;
- [x] it should work the same as several individual updates of the todos which statuses were actually changed;
- [x] don't send requests for the todos that were not changed;

## Renaming a todo

[x] Implement the ability to edit a todo title on double click:

- [x] show the edit form instead of the title and remove button;
- [x] saves changes on the form submit (just press `Enter`);
- [x] save changes when the field loses focus (`onBlur`);
- [x] if the new title is the same as the old one just cancel editing;
- [x] cancel editing on `Esс` key `keyup` event;
- [x] if the new title is empty delete the todo the same way the `x` button does it;
- [x] if the title was changed show the loader while waiting for the API response;
- [x] update the todo title on success;
- [x] show `Unable to update a todo` in case of API error;
- [x] or the deletion error message if we tried to delete the todo.

## If you want to enable tests
- open `cypress/integration/page.spec.js`
- replace `describe.skip` with `describe` for the root `describe`

> [ ] ❗❗All tests should pass, even if some behaviour is not well explained in the task❗❗

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://sanchez-primal.github.io/react_todo-app-with-api/) and add it to the PR description.

# Interesting stuff:
- Compare batch functions
