import { useContext } from "react";
import cn from "classnames";
import { TodosContext } from "../services/Store";
import { Status } from "../types/Status";
import * as todoService from "../api/todos";
import { ErrorText } from "../enums/errorText";
import { Todo } from "../types/Todo";

export const TodoFooter: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setLoadErrorMessage,
    setTodosWithLoader,
  } = useContext(TodosContext);

  const activeTodos = todos.filter((todo) => !todo.completed);

  const handleClearComletedButton = () => {
    const completedTodos = todos.filter((todoItem) => todoItem.completed);

    const todosForLoading: Todo[] = [];
    const todosForRemove: Todo[] = [];

    completedTodos.forEach((todoElement) => {
      todosForLoading.push(todoElement);
    });

    setTodosWithLoader(todosForLoading);

    completedTodos.forEach((completedTodo) => {
      return todoService
        .deleteTodo(completedTodo.id)
        .then(() => {
          todosForRemove.push(completedTodo);
        })
        .catch((error) => {
          setLoadErrorMessage(ErrorText.Deliting);
          throw error;
        })
        .finally(() => {
          setTodosWithLoader([]);

          const RemovedTodosIds = todosForRemove.map(
            (removeTodo) => removeTodo.id,
          );

          const withoutRemovedTodos = todos.filter(
            (todoItem) => !RemovedTodosIds.includes(todoItem.id),
          );

          setTodos(withoutRemovedTodos);
        });
    });
  };

  const completedTodos = todos.some((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length === 1
          ? `${activeTodos.length} item left`
          : `${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn("filter__link", {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter(Status.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn("filter__link", {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter(Status.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn("filter__link", {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearComletedButton}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
