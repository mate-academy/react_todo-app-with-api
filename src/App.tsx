/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  createTodo, deleteTodo, getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const onError = useCallback((errorTitle: string) => {
    setErrorMessage(errorTitle);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    if (user) {
      setErrorMessage('');

      getTodos(user.id)
        .then(setTodos)
        .catch(onError)
        .finally(() => setShouldUpdate(false));
    }
  }, [user, shouldUpdate]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addTodo = () => {
    if (!newTitle) {
      onError('Title can\'t be empty');

      return;
    }

    if (user) {
      createTodo(newTitle, user.id, false)
        .then((res) => {
          setTodos(prev => [...prev, res]);
          setSelectedTodoId(res.id);
        })
        .catch(() => onError('Unable to add a todo'));
    }
  };

  const removeTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setShouldUpdate(true);
        }
      })
      .catch(() => onError('Unable to delete a todo'));
  };

  const handleUpdate = (isUpdated: boolean) => {
    setShouldUpdate(isUpdated);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
              setTimeout(() => setNewTitle(''), 500);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={removeTodo}
          onError={onError}
          handleUpdate={handleUpdate}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.length} items left`}
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

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />

          {errorMessage}
        </div>
      )}
    </div>
  );
};
