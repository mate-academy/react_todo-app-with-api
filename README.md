# Checklist App with API Integration

The Checklist App is designed to help you efficiently manage your tasks. This application utilizes an API client implemented in the ./src/utils/fetchClient.ts file, enabling seamless communication with the server through such methods as get, post, patch, delete.

## Using technologies:
-HTML
-SCSS
-TypeScript
-React

[DEMO LINK](https://julshvets.github.io/react_todo-app-with-api/)

## Features

### Task Filtering
Tasks can be filtered by status: All, Active, or Completed.

### Adding Tasks
To add a task, input its title and submit the form. This triggers a POST request to the API.
If the title field is empty, a "Title can't be empty" notification is shown.
The input is disabled until a response is received from the API.
Upon submission, a temporary task with the ID 0 is displayed in the app, accompanied by a loader.
If successful, the API-generated task is added to the list.
If an API error occurs, an error notification is displayed.

### Deleting Tasks
Tasks can be deleted individually by clicking the delete button.
Deleted tasks display a loader while waiting for the API response.
If the API encounters an error during deletion, an "Unable to delete a task" notification is shown.
The "Clear Completed" button removes all completed tasks.

### Toggling Task Status
The status of a task can be toggled by changing its completion status.
Toggling a task displays a loader overlay while waiting for the API response.
Successful API responses update the task's status.
In case of API errors, an "Unable to update a task" notification is shown.

### Renaming Tasks
Double-clicking on a task's title allows you to edit it.
Changes can be saved by pressing Enter or when the field loses focus.
Editing cancels if the new title is the same as the old one.
Editing is canceled when the Esc key is pressed.
If the new title is empty, the task is deleted.
During API response wait, a loader is displayed.
In case of success, the task title is updated.
If API errors occur, relevant error notifications are displayed.

### Error Handling
In case of any error show the notification with an appropriate message at the bottom of the screen:

The notification can be closed with the close button.
The notification is automatically hidden after 3 seconds or before any next request.

## How to Use the Project
You can try this Checklist App just by click on [DEMO LINK](https://julshvets.github.io/react_todo-app-with-api/)
