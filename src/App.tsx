/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodos,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { DispatchContext, StateContext } from './utils/GlobalStateProvider';

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { filter, todos, isDisabled, tempTodo, error } =
    useContext(StateContext);
  const [isHidden, setIsHidden] = useState(true);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const isNoCompletedTodos = todos.filter(todo => todo.completed).length === 0;
  let timerErrorId = 0;

  //#region handlers
  const setError = (errorMessage: Errors, delay = 3000) => {
    dispatch({ type: 'setError', payload: errorMessage });
    setIsHidden(false);

    if (timerErrorId) {
      window.clearTimeout(timerErrorId);
    }

    timerErrorId = window.setTimeout(() => {
      dispatch({ type: 'setError', payload: Errors.reset });
    }, delay);
  };

  const handleError = useCallback(
    (message: Errors) => setError(message),
    /* eslint-disable react-hooks/exhaustive-deps */
    [error],
  );

  const filteredTodos = () => {
    switch (filter) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);

      case Filter.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const reset = () => {
    dispatch({ type: 'setTempTodo', payload: null });
    dispatch({ type: 'setIsDisabled', payload: false });
  };

  const memorizedTodos = useMemo(filteredTodos, [filter, todos]);
  const todosCounter = todos.reduce(
    (prev, current) => prev + +!current.completed,
    0,
  );

  const handleDeleteAll = () => {
    const deletingIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const failedTodos: number[] = [];

    dispatch({ type: 'setProcessingList', payload: deletingIds });

    Promise.allSettled(deletingIds.map(id => deleteTodos(id)))
      .then(results => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            failedTodos.push(deletingIds[i]);
            handleError(Errors.deletingError);
          }

          dispatch({
            type: 'setTodos',
            payload: todos.filter(
              todo =>
                !deletingIds.includes(todo.id) || failedTodos.includes(todo.id),
            ),
          });
        });
      })

      .finally(() => {
        dispatch({ type: 'setProcessingList', payload: [] });
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'setError', payload: Errors.reset });
    dispatch({ type: 'setIsDisabled', payload: true });

    if (!title.trim()) {
      handleError(Errors.emptyTitle);
      reset();

      return;
    }

    dispatch({
      type: 'setTempTodo',
      payload: {
        title,
        completed: false,
        userId: USER_ID,
        id: 0,
      },
    });

    return postTodo({ title })
      .then(newTodo => {
        const { id } = newTodo;

        dispatch({
          type: 'setTodos',
          payload: [
            ...todos,
            {
              id,
              title: title.trim(),
              userId: USER_ID,
              completed: false,
            },
          ],
        });

        setTitle('');
        inputRef.current?.focus();
      })
      .catch(promiseError => {
        handleError(Errors.addingError);
        throw promiseError;
      })
      .finally(() => {
        reset();
      });
  };

  const handleToggleAll = () => {
    let updatingIds = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    const isThereAnyUncompleted = updatingIds.length > 0;

    if (!isThereAnyUncompleted) {
      updatingIds = todos.map(todo => todo.id);
    }

    dispatch({ type: 'setProcessingList', payload: updatingIds });

    Promise.allSettled(
      updatingIds.map(updatingId =>
        updateTodo(updatingId, {
          ...(todos.find(todo => todo.id === updatingId) || todos[0]),
          completed: isThereAnyUncompleted,
        }),
      ),
    )
      .then(results => {
        results.forEach(result => {
          if (result.status === 'rejected') {
            handleError(Errors.updateError);
          }

          dispatch({
            type: 'setTodos',
            payload: [
              ...todos.map(todo => {
                if (updatingIds.includes(todo.id)) {
                  return {
                    ...todo,
                    completed: isThereAnyUncompleted,
                  };
                }

                return todo;
              }),
            ],
          });
        });
      })
      .finally(() => {
        dispatch({ type: 'setProcessingList', payload: [] });
      });
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    getTodos()
      .then(recievedTodos => {
        dispatch({ type: 'setTodos', payload: recievedTodos });
      })
      .catch(() => {
        handleError(Errors.loadingError);
      })
      .finally(() => {
        setTimeout(() => setIsHidden(false), 500);
      });

    inputRef.current?.focus();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  //#endregion
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isHidden && todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active:
                  todos.filter(todo => todo.completed).length === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              value={title}
              ref={inputRef}
              disabled={isDisabled}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setTitle(e.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={memorizedTodos}
          independentTodo={tempTodo}
          handleError={handleError}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosCounter} items left`}
            </span>

            <TodoFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteAll}
              disabled={isNoCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: error.length === 0 || isHidden,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsHidden(true)}
        />
        {error}
      </div>
    </div>
  );
};
