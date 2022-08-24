/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  addTodo,
  changeTodoStatus,
  getTodos,
} from './api/todos';
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [getDataFlag, setGetDataFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }
  }, [getDataFlag]);

  // eslint-disable-next-line no-console
  console.log(todos);

  const handlerAddTodo = (title: string) => {
    if (user) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      addTodo(newTodo)
        .finally(() => setGetDataFlag(!getDataFlag));
    }
  };

  const handlerTodoStatusToggle = (id: number, status: boolean) => {
    setIsLoading(true);
    changeTodoStatus(id, { completed: !status })
      .finally(() => {
        setGetDataFlag(!getDataFlag);
        setIsLoading(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <AddTodoForm addNewTodo={handlerAddTodo} />
        </header>

        <TodoList
          todos={todos}
          changeTodoStatus={handlerTodoStatusToggle}
          isLoading={isLoading}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
