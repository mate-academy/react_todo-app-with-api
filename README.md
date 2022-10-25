# React Todo App with API (complete)

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)


Error messages

- the notification can be closed with the close button;
- automatically hide the notification in 3 seconds;
- also hide the notification before any next request;

Filtering todos
Filter todos by status All / Active / Completed:

- an active filter link should be hightlighted;

Adding a todo
Add a todo with the entered title form submit:

- if the title is empty show the Title can't be empty notification at the bottom;
- disable the input until receiving the response from the API;
- show the loader on the added todo;
- use your user id for the new todo;
- in case of success and add the todo create by API to the array;
- in case of API error show Unable to add a todo notification at the bottom;
- the temp todo should be removed in any case;
- covered the todo with a loader overlay while wating for API response;

## Renaming a todo

Implement the ability to rename a todo title on double click:

- saves changes on the form submit (just press `Enter`);
- save changes when the field loses focus (`onBlur`);
- cancel editing on `Ecs` key `keydown`;
- if the new title is empty delete the todo the same way the `x` button does it;
- if the title was changed show the loader while waiting for the API response;
- update the todo title on success;

- [DEMO LINK](https://BogdanFdVlpr.github.io/react_todo-app-with-api/)
