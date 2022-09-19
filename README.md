# Todo App

Main functionality:
 - On the first display, the user sees an `authorization` form in which he must specify an `e-mail` and after that a `name` input field will appear. After clicking on the `"Register"` button, the user's data is stored in the `Local Storage` and further authorization is not needed after the page is refreshed.
 - The user goes to the main window of the `ToDo list management application`. If the current user's to-do list is empty, only the `Enter new ToDo input` will be available to him. Submission of data occurs by pressing the `Enter key`. ToDo is uploaded to the server and displayed in the `ToDo list`
 - In the `ToDo list` to the left of the `ToDo name` there is a `Radio-button` that switches the ToDo state to "completed" and back.
 - There is a functionality to `edit` the name of the ToDo in the list by double clicking on it and `delete` the ToDo using the delete button (appears on hover).
 - In the footer of the list there is a `counter of completed ToDos`, buttons for `filtering the ToDo list` (all, active, completed) and a button for `deleting completed ToDos` from the list.

Technical specifications:
 - The application was created using the `React` library (functional components) + `TypeScript`.
 - State management is implemented using `"Use state"` React hooks for the application's core data. The state of the user's data is passed through the application using the `"Use Context"` hook.
 - The design is made using `Bulma's` CSS framework.
 - Requests to the server are implemented by using `Fetch` .
