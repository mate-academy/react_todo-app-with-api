# React Todo App with API

This React Todo App is designed to provide a user-friendly interface for managing tasks. The app is powered by an API client implemented in the './src/utils/fetchClient.ts' file, allowing seamless communication with the server using various methods.

Technologies: HTML, SCSS, TypeScript, React

If you want to see the page, please, click [here]( https://annholovko.github.io/react_todo-app-with-api/)

## Toggling a todo status


Implemented toggling the completed status on TodoStatus change:

covered the todo with a loader overlay while wating for API response;
the status should is changed on success;
Unable to update a todo notification is shown in case of API error.
Added the ability to toggle the completed status of all the todos with the toggleAll checkbox:

toggleAll button has active class only if all the todos are completed;
toggleAll click changes its status to the oppsite one, and sets it to all the todos.

## Renaming a todo

Implemented the ability to edit a todo title on double click:

the edit form is shown instead of the title and remove button;
changes can be saved on the form submit (press Enter);
if new title is the same as the old one editing is cancelled;
editing is cancelled on Esс key;
if the new title is empty, todo gets deleted;
if the title is changed, the loader works while waiting for the API response;
Unable to update a todo is shown in case of API error.

## Adding a todo

Implemented adding:

todo can be added with the entered title on the form submit with the help of POST request to the API;
if the title is empty the Title can't be empty notification is shown at the bottom;
the input is disabled until receiving a response from the API;
immediately after sending a request a todo is created with id: 0 and saved to the tempTodo variable in the state;
temp TodoItem has the loader;
in case of success the todo created by the API is added to the array;
in case of an API error error notifications are shown.

## Deleting a todo

Implemented deleting:

the todo is removed on TodoDeleteButton click;
the todo is covered with the loader while wating for the API response;
in case of API error Unable to delete a todo is shown at the bottom;
all the completed todos can be removed after the Clear completed button click.

## Error messages

In case of any error the notification is shown with an appropriate message at the bottom:

the notification can be closed with the close button;
the notification is automatically hidden after 3 seconds or before any next request.

## Filtering todos


Implemented filtering of todos by status All / Active / Completed.



