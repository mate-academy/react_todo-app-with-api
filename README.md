# React Todo App with API (complete)

## Toggling a todo status

Toggle the `completed` status on `TodoStatus` change:

- covered the todo with a loader overlay while wating for API response;
- the status should be changed on success;
- show the `Unable to update a todo` notification in case of API error.

Added the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- `toggleAll` button should have `active` class only if all the todos are completed;
- `toggleAll` click changes its status to the oppsite one, and set it to all the todos;
- it work the same as several individual updates of the todos which statuses were actually changed;
- do send requests for the todos that were not changed;

## Renaming a todo

Implemented the ability to edit a todo title on double click:

- shown the edit form instead of the title and remove button;
- saves changes on the form submit (just press `Enter`);
- saves changes when the field loses focus (`onBlur`);
- cancel editing on `Esс` key `keyup` event;
- if the new title is empty delete the todo the same way the `x` button does it;
- if the title was changed show the loader while waiting for the API response;
- updated the todo title on success;
- show `Unable to update a todo` in case of API error;
- or the deletion error message if we tried to delete the todo.