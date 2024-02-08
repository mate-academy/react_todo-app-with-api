/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
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
    completedTodoIds, setDeleteLoading, setSelectedTodo, setToggleAllLoading, inputRef, focusInput,
  } = useContext(TodosContext);

  // #region error handling
  const handleErrorHiding = useCallback(() => {
    setErrorHidden(true);
  }, [setErrorHidden]);

  useEffect(() => {
    setTimeout(handleErrorHiding, 3000);
  }, [errorMessage, handleErrorHiding]);

  // #endregion

  const loadTodos = useCallback(() => {
    setLoadingTodos(true);
    setErrorHidden(true);

    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorHidden(false);
      })
      .finally(() => setLoadingTodos(false));
  }, [setErrorHidden, setErrorMessage, setLoadingTodos, setTodos]);

  useEffect(() => loadTodos(), [loadTodos, setErrorHidden, setErrorMessage, setLoadingTodos, setTodos]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const canToggleAll = todos.length > 0;
  // const allTodosCompleted = todos.every((todo) => todo.completed);

  const handleToggleAllClick = () => {
    setSelectedTodo(null);
    setToggleAllLoading(true);
    setErrorHidden(true);
    setErrorMessage('');

    if (canToggleAll) {
      const hasIncompleteTodos = todos.some(todo => !todo.completed);
      const hasCompletedTodos = todos.some(todo => todo.completed);
      const newStatus = hasIncompleteTodos; // true or false
      let todoUpdates = null;

      if (hasIncompleteTodos && hasCompletedTodos) {
        todoUpdates = activeTodos.map(todo => ({ todoId: todo.id, completed: newStatus }));
      } else {
        todoUpdates = todos.map(todo => ({ todoId: todo.id, completed: newStatus }));
      }

      postService.editTodos(todoUpdates)
        .then(() => {
          setTodos(todos.map(todo => ({ ...todo, completed: newStatus })));
        })
        .catch(() => {
          setTodos(todos);
          setErrorMessage('Unable to upload todos');
          setErrorHidden(false);
        })
        .finally(() => setToggleAllLoading(false));
    }
  };

  const deleteCompletedTodos = () => {
    setSelectedTodo(null);
    setDeleteLoading(true);
    setErrorHidden(true);
    setErrorMessage('');

    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    const todosToDelete = todos.filter(todo => todo.completed);
    const todosToKeep = todos.filter(todo => !todo.completed);

    return postService.removeTodos(completedTodoIds)
      .then(() => setTodos(todosToKeep))
      .catch((error) => {
        const restoredCompletedTodos = todosToDelete.filter(todo => completedTodoIds.includes(todo.id));
        const restoredTodos = [
          ...todosToKeep,
          ...restoredCompletedTodos];

        const sortedRestoredTodos = restoredTodos.sort((a, b) => a.id - b.id);

        setTodos(sortedRestoredTodos);

        setErrorHidden(false);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setDeleteLoading(false);
        focusInput();
      });
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

  useEffect(() => {
    if ((!loadingTodos || tempTodo === null) && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [loadingTodos, tempTodo, inputRef]);

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
              className={`todoapp__toggle-all ${completedTodos.length === todos.length && 'active'}`}
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
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={deleteCompletedTodos}
              style={{ visibility: completedTodos.length > 0 ? 'visible' : 'hidden' }}
              disabled={completedTodos.length === 0}
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
