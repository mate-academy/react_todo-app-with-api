/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect, useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodosContext } from './components/TodosContext';

const USER_ID = 77;

export const App: React.FC = () => {
  const {
    todos, setTodos, title, setTitle, loadingTodos, setLoadingTodos,
    errorMessage, setErrorMessage, errorHidden, setErrorHidden, tempTodo, setTempTodo,
  } = useContext(TodosContext);

  // #region error handling
  const handleErrorHiding = () => {
    setErrorHidden(true);
  };

  useEffect(() => {
    setTimeout(handleErrorHiding, 3000);
  }, [errorMessage]);

  // #endregion

  function loadTodos() {
    setLoadingTodos(true);
    setErrorHidden(true);

    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorHidden(false);
      })
      .finally(() => setLoadingTodos(false));
  }

  useEffect(loadTodos, [setErrorHidden, setErrorMessage, setLoadingTodos, setTodos]);

  const canToggleAll = todos.length > 0;
  const allTodosCompleted = todos.every((todo) => todo.completed);

  const handleToggleAllClick = () => {
    if (canToggleAll) {
      setTodos(todos.map((todo) => (
        { ...todo, completed: !allTodosCompleted }
      )));
    }
  };

  const addTodo = ({
    title: currentTitle, completed, userId,
  }: Todo) => {
    const newTempTodo = {
      id: 0,
      title: currentTitle.trim(),
      completed,
      userId,
    };

    setErrorHidden(true);
    setErrorMessage('');
    setTempTodo(newTempTodo);

    if (!newTempTodo.title.trim()) {
      setErrorMessage('Title should not be empty');
      setTempTodo(null);
      setErrorHidden(false);

      return Promise.resolve();
    }

    return postService.createTodo({ title: currentTitle.trim(), completed, userId })
      .then((createdTodo) => {
        setTodos((prevTodos) => [
          ...prevTodos, createdTodo,
        ]);
        setTempTodo(null);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        setErrorHidden(false);
        throw error;
      });
  };

  const deleteCompletedTodos = () => {
    const comnpletedTodoIds = todos.filter(todo => todo.completed).map(todo => todo.id);

    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

    return postService.removeTodos(comnpletedTodoIds)
      .catch((error) => {
        setTodos(todos);
        setErrorHidden(false);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((!loadingTodos || tempTodo === null) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingTodos, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          { !loadingTodos
          && !!todos.length
          && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
              onClick={handleToggleAllClick}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={tempTodo !== null}
              ref={inputRef}
            />
          </form>
        </header>
        {
          !loadingTodos
          && !!todos.length
          && (
            <TodoList />
          )
        }
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos} items left`}
            </span>

            <TodoFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={deleteCompletedTodos}
              style={{ visibility: completedTodos > 0 ? 'visible' : 'hidden' }}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorHidden && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorHiding}
        />
        {errorMessage}
      </div>
    </div>
  );
};
