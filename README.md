# React Todo App with API (complete)

It is the third part of the React Todo App with API.

Take your code implemented for [Add and Delete](https://github.com/mate-academy/react_todo-app-add-and-delete)
and implement the ability to toggle and rename todos.

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)

## Toggling a todo status

Toggle the `completed` status on `TodoStatus` change:

- covered the todo with a loader overlay while waiting for API response;
- the status should be changed on success;
- show the `Unable to update a todo` notification in case of API error.

Add the ability to toggle the completed status of all the todos with the `toggleAll` checkbox:

- `toggleAll` button should have `active` class only if all the todos are completed;
- `toggleAll` click changes its status to the opposite one, and sets this new status to all the todos;
- it should work the same as several individual updates of the todos which statuses were actually changed;
- do send requests for the todos that were not changed;

## Renaming a todo

Implement the ability to edit a todo title on double click:

- show the edit form instead of the title and remove button;
- saves changes on the form submit (just press `Enter`);
- save changes when the field loses focus (`onBlur`);
- if the new title is the same as the old one just cancel editing;
- cancel editing on `Esс` key `keyup` event;
- if the new title is empty delete the todo the same way the `x` button does it;
- if the title was changed show the loader while waiting for the API response;
- update the todo title on success;
- show `Unable to update a todo` in case of API error;
- or the deletion error message if we tried to delete the todo.

## If you want to enable tests
- open `cypress/integration/page.spec.js`
- replace `describe.skip` with `describe` for the root `describe`

> ❗❗All tests should pass, even if some behaviour in not well explained in the task❗❗

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://vSainiuk.github.io/react_todo-app-with-api/) and add it to the PR description.

## IF you want to implement smooth animations

<details>
  <summary>Click here to see the hint</summary>

  Use [React Transition Group](https://reactcommunity.org/react-transition-group/transition-group)

  ```tsx
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            isProcessed={processings.includes(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onUpdate={updateTodo}
          />
        </CSSTransition>
      ))}

      {creating && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={{
              id: Math.random(),
              title,
              completed: false,
              userId: user.id,
            }}
            isProcessed
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
  ```

  Here are the styles used in this example
  ```css
  .item-enter {
    max-height: 0;
  }

  .item-enter-active {
    overflow: hidden;
    max-height: 58px;
    transition: max-height 0.3s ease-in-out;
  }

  .item-exit {
    max-height: 58px;
  }

  .item-exit-active {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease-in-out;
  }

  .temp-item-enter {
    max-height: 0;
  }

  .temp-item-enter-active {
    overflow: hidden;
    max-height: 58px;
    transition: max-height 0.3s ease-in-out;
  }

  .temp-item-exit {
    max-height: 58px;
  }

  .temp-item-exit-active {
    transform: translateY(-58px);
    max-height: 0;
    opacity: 0;
    transition: 0.3s ease-in-out;
    transition-property: opacity, max-height, transform;
  }

  .has-error .temp-item-exit-active {
    transform: translateY(0);
    overflow: hidden;
  }
  ```
</details>
