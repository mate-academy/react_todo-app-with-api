import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, editTodo, getTodos, USER_ID } from './api/todos';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(Error.noError);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([-1]);

  const inputField = useRef<HTMLInputElement>(null);

  const isError = useMemo(() => {
    return error !== Error.noError;
  }, [error]);

  const errorTimeout = useRef(0);

  const resetErrors = useCallback(() => {
    window.clearTimeout(errorTimeout.current);

    errorTimeout.current = window.setTimeout(() => {
      setError(Error.noError);
    }, 3000);
  }, []);

  const isEveryTodoCompleted = useMemo(() => {
    return todosFromServer.every(todo => todo.completed);
  }, [todosFromServer]);

  const isLoadingNewTodo = useMemo(() => {
    return todosFromServer.some(todo => todo.id === -1);
  }, [todosFromServer]);

  const isTodoListShown = useMemo(() => {
    return !loading && !!todosFromServer.length;
  }, [todosFromServer, loading]);

  const areThereCompletedTodos = useMemo(() => {
    return todosFromServer.some(todo => todo.completed);
  }, [todosFromServer]);

  const activeTodosCount = useMemo(() => {
    return todosFromServer.reduce((prev, todo) => {
      if (!todo.completed && todo.id !== -1) {
        return prev + 1;
      }

      return prev;
    }, 0);
  }, [todosFromServer]);

  const displayedTodos = useMemo(() => {
    switch (filter) {
      case Filter.All:
        return todosFromServer;

      case Filter.Active:
        return todosFromServer.filter(todo => !todo.completed);

      case Filter.Completed:
        return todosFromServer.filter(todo => todo.completed);
    }
  }, [todosFromServer, filter]);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }

    setLoading(true);

    getTodos()
      .then(setTodosFromServer)
      .catch(caughtError => {
        setError(Error.loadingError);
        resetErrors();
        throw caughtError;
      })
      .finally(() => setLoading(false));
  }, [resetErrors]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewTodoTitle(e.target.value),
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>, title: string) => {
      e.preventDefault();
      setError(Error.noError);
      if (!title.trim()) {
        setError(Error.emptyTitleError);
        resetErrors();

        return;
      }

      setTodosFromServer(currentTodos => [
        ...currentTodos,
        {
          id: -1,
          userId: USER_ID,
          title: title,
          completed: false,
        },
      ]);

      addTodo({ title: title.trim(), userId: USER_ID, completed: false })
        .then(newTodo => {
          setTodosFromServer(currentTodos => {
            return [...currentTodos.slice(0, -1), newTodo];
          });

          setNewTodoTitle('');
        })
        .catch(caughtError => {
          setError(Error.addingError);
          resetErrors();
          setTodosFromServer(currentTodos => currentTodos.slice(0, -1));
          throw caughtError;
        })
        .finally(() => {
          setTimeout(() => {
            if (inputField.current) {
              inputField.current.focus();
            }
          }, 0);
        });
    },
    [resetErrors],
  );

  const handleDelete = useCallback(
    (todoId: number) => {
      setError(Error.noError);
      setLoadingTodosIds(currentIds => [...currentIds, todoId]);

      return deleteTodo(todoId)
        .then(() => {
          setTodosFromServer(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(caughtError => {
          setError(Error.deletingError);
          resetErrors();
          throw caughtError;
        })
        .finally(() => {
          setLoadingTodosIds(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
        });
    },
    [resetErrors],
  );

  const handleClearCompleted = useCallback(
    (todos: Todo[]) => {
      todos.forEach(todo => {
        if (todo.completed) {
          handleDelete(todo.id).finally(() => {
            setTimeout(() => {
              if (inputField.current) {
                inputField.current.focus();
              }
            }, 0);
          });
        }
      });
    },
    [handleDelete],
  );

  const handleEditTodo = useCallback(
    (todoId: number, data: Todo) => {
      setError(Error.noError);
      setLoadingTodosIds(currentIds => [...currentIds, todoId]);

      return editTodo(todoId, data)
        .then(newTodo => {
          setTodosFromServer(currentTodos =>
            currentTodos.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
          );
        })
        .catch(caughtError => {
          setError(Error.updatingError);
          resetErrors();
          throw caughtError;
        })
        .finally(() => {
          setLoadingTodosIds(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
        });
    },
    [resetErrors],
  );

  const handleToggleAll = useCallback(() => {
    if (isEveryTodoCompleted) {
      todosFromServer.forEach(todo => {
        handleEditTodo(todo.id, {
          id: todo.id,
          userId: USER_ID,
          title: todo.title,
          completed: false,
        });
      });
    } else {
      todosFromServer.forEach(todo => {
        if (!todo.completed) {
          handleEditTodo(todo.id, {
            id: todo.id,
            userId: USER_ID,
            title: todo.title,
            completed: true,
          });
        }
      });
    }
  }, [todosFromServer, handleEditTodo, isEveryTodoCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todosFromServer.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isEveryTodoCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={e => handleSubmit(e, newTodoTitle)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleInputChange}
              disabled={isLoadingNewTodo}
              ref={inputField}
            />
          </form>
        </header>

        {isTodoListShown && (
          <TodoList
            todosFromServer={todosFromServer}
            displayedTodos={displayedTodos}
            loadingTodosIds={loadingTodosIds}
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            areThereCompletedTodos={areThereCompletedTodos}
            handleDelete={handleDelete}
            handleClearCompleted={handleClearCompleted}
            handleEditTodo={handleEditTodo}
            newTodoInput={inputField}
          />
        )}
      </div>

      <ErrorNotification isError={isError} error={error} />
    </div>
  );
};
