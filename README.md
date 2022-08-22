# React Todo App with API

You are give the markup of the Todo App. Split it into components and
implement the functionality saving all the changes to [the API](https://mate-academy.github.io/fe-students-api/).

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

> Tests are NOT implemented yet

1. You have an implemented simple login form. Enter your email to create a user or find an existing one in the API;
    - all the todos request MUST work with the found user id (not to change data of other users);
1. Load the user todos when the `App` is loaded;
1. All the changes MUST be saved to the API before updating the page;
1. In case of any error show the notification with an appropriate message at the botton (just remove the `hidden` class);
    - the notification can be closed with the `close` button (add the `hidden` class);
    - automatically hide the notification in 3 seconds
    - also hide the notification before any next request;
1. Add a todo with the entered title on `NewTodoField` form submit:
    - show the `Title can't be empty` notification at the bottom if the user tries to submit an empty form;
    - show a new `Todo` with loader in the list while waiting for the API response;
    - in case of API error show `Unable to add a todo` notification at the bottom (the todo should not be added to the list);
1. Remove a todo on `TodoDeleteButton` click;
    - covered the todo with a loader overlay while wating for API response;
    - remove the todo from the list on success;
    - in case of API error show `Unable to delete a todo` notification at the bottom (the todo must stay in the list);
1. `Clear completed` button should remove all the completed todos.
    - the button should be visible if there is at least 1 completed todo;
    - the deletion should work as a several individual deletions running at the same time;
1. Toggle the `completed` status on `TodoStatus` change;
    - covered the todo with a loader overlay while wating for API response;
    - the status should be changed on success;
    - show the `Unable to update a todo` notification in case of API error;
1. Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox.
    - `toggleAll` should have `active` class only if all the todos are completed;
    - `toggleAll` click changes its status to the oppsite one, and set it to all the todos;
    - it should work the same as several individual updates of the todos which statuses were actually changed;
    - do not show spinners for not changed todos;
1. Edit todo title on double click;
    - show the`TodoTitleField` instead of the `TodoTitle` and `TodoDeleteButton`;
    - saves changes on the form submit (just press `Enter`);
    - save changes when the field loses focus (`onBlur`);
    - if new title is the same as the old one just cancel editing;
    - cancel editing on `Ecs` key `keydown`;
    - if the new title is empty delete the todo the same way the `x` button do it;
    - if the title was changed should the loader while waiting for the API response;
    - update the todo title on success;
    - show `Unable to update a todo` in case of API error or the deletion error message if we tried to delete the todo;
1. Filter todos by status `All` / `Active` / `Completed`
1. Hide everything except the `NewTodoField` if there are no todos yet;
    - Don't hide everything if todos are just filtered out.

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Open one more terminal and run tests with `npm test` to ensure your solution is correct.
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_todo-app-with-api/) and add it to the PR description.
