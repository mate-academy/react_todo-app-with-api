# React Phone catalog

_Design:_

[design](https://www.figma.com/file/uEetgWenSRxk9jgiym6Yzp/Phone-catalog-redesign?node-id=1%3A2)

_Description:_

Simple responsive todo-app example with creating, deleting, changing, toggling and filtering. Based on free learning api Mate-academy.

_Demo_link:_  

https://haduigon.github.io/react_todo-app-with-api/

_Status:_  

Done

[![GitHub license](https://img.shields.io/github/license/haduigon/fb_horo_chat_landing)](https://github.com/haduigon/fb_horo_chat_landing/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/haduigon/fb_horo_chat_landing)](https://github.com/haduigon/fb_horo_chat_landing/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/haduigon/fb_horo_chat_landing)](https://github.com/haduigon/fb_horo_chat_landing/issues)
[![GitHub forks](https://img.shields.io/github/forks/haduigon/fb_horo_chat_landing)](https://github.com/haduigon/fb_horo_chat_landing/network)

_Usage:_   

git clone

npm i

npm start

_Screenshots are bellow:_  

<details>
  <img width="1792" alt="Screenshot 2024-06-05 at 16 57 59" src="https://github.com/haduigon/react_todo-app-with-api/assets/20277989/35968918-5048-40c5-ac2f-f1ab4d32f364">
</details>





# React Todo App with API (complete)

It is the third part of the React Todo App with API.

Take your code implemented for [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
and implement the ability to toggle and rename todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

## Toggling a todo status

Toggle the `completed` status on `TodoStatus` change:

- covered the todo with a loader overlay while wating for API response;
- the status should be changed on success;
- show the `Unable to update a todo` notification in case of API error.

Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- `toggleAll` button should have `active` class only if all the todos are completed;
- `toggleAll` click changes its status to the oppsite one, and sets this new status to all the todos;
- it should work the same as several individual updates of the todos which statuses were actually changed;
- do send requests for the todos that were not changed;

## Renaming a todo

Implement the ability to edit a todo title on double click:

- show the edit form instead of the title and remove button;
- saves changes on the form submit (just press `Enter`);
- save changes when the field loses focus (`onBlur`);
- if new title is the same as the old one just cancel editing;
- cancel editing on `Esс` key `keyup` event;
- if the new title is empty delete the todo the same way the `x` button does it;
- if the title was changed show the loader while waiting for the API response;
- update the todo title on success;
- show `Unable to update a todo` in case of API error;
- or the deletion error message if we tried to delete the todo.

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://haduigon.github.io/react_todo-app-with-api/) and add it to the PR description.
