To-Do List Application

This project is a single-page application (SPA) developed using React and TypeScript that allows users to manage a list of tasks. The application is fully functional with the ability to create, update, delete, and filter tasks based on their completion status. It also includes robust error handling to manage API interactions, ensuring a smooth user experience.

Key Features:

1. Task Management:

- Add Tasks: Users can create new tasks with a title and mark them as completed or active.
- Edit Tasks: Existing tasks can be updated, including toggling their completion status.
- Delete Tasks: Users can delete individual tasks or all completed tasks at once.
- Filter Tasks: Tasks can be filtered by their status (all, active, completed) to allow users to focus on what matters most.

2. Error Handling:

- The application handles errors that may occur during API requests, such as fetching, adding, updating, or deleting tasks. Error messages are displayed to the user and can be dismissed manually.

3. Real-Time Feedback:

- Loading states are managed and displayed to the user during API interactions to ensure a responsive experience.
- A temporary task (placeholder) is displayed while a new task is being added, enhancing the user experience by providing immediate feedback.

Technologies Used:

- React: The core library for building the user interface and managing the application state.
- TypeScript: Provides type safety, reducing the likelihood of runtime errors and improving code quality.
- Classnames: A utility for conditionally joining CSS class names, simplifying dynamic styling.
- SCSS: A CSS preprocessor used to style the application, allowing for nested rules, variables, and mixins.


- [DEMO LINK](https://HumenVAsya.github.io/react_todo-app-with-api/)

Ensure you have Node.js installed on your machine. Then, install the project dependencies using npm: npm install

npm start

This will start the application on http://localhost:3000 by default. You can open this URL in your browser to interact with the application.
