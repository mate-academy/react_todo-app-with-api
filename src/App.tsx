/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { wait } from './utils/fetchClient';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const allChecked = todos.every((todo: Todo) => todo.completed);
  const [isActive, setIsActive] = useState(allChecked);
  const [serverError, setServerError] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  const todosToToggle = todos.filter(todo => todo.completed === isActive);

  useEffect(() => {
    setLoading(true);
    todoService
      .getTodos()
      .then(todosFromServer => {
        wait(1000);
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Error.UnableToLoadAll);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (titleField.current) {
      return titleField.current.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    setIsActive(allChecked);
  }, [allChecked]);

  useEffect(() => {
    let timeoutId = 0;

    if (errorMessage) {
      timeoutId = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filterTodos = useCallback(
    (currentTodos: Todo[], currentFilter: Filter) => {
      if (currentFilter === Filter.Active) {
        return currentTodos.filter((todo: Todo) => !todo.completed);
      } else if (currentFilter === Filter.Completed) {
        return currentTodos.filter((todo: Todo) => todo.completed);
      } else {
        return currentTodos;
      }
    },
    [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [filterTodos, filter, todos]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setErrorMessage('');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim()) {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTempTodo({
      id: 0,
      title: input.trim(),
      userId: todoService.USER_ID,
      completed: false,
    });

    return todoService
      .addTodo({
        userId: todoService.USER_ID,
        title: input.trim(),
        completed: false,
      })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setInput('');
        setTempTodo(null);
      })
      .catch(error => {
        setTodos(todos);
        setTempTodo(null);
        setErrorMessage(Error.UnableToAdd);
        throw error;
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setLoadingTodoIds(prev => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter((todo: Todo) => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        setIsSubmitting(false);
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    setIsSubmitting(true);

    const deletePromises = completedTodos.map(todo => {
      setLoadingTodoIds(prev => [...prev, todo.id]);

      return todoService.deleteTodo(todo.id);
    });

    Promise.allSettled(deletePromises)
      .then(results => {
        const deletingIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            deletingIds.push(completedTodos[index].id);
          } else {
            setErrorMessage(Error.UnableToDelete);
          }
        });

        deletingIds.forEach(deletingId => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== deletingId),
          );
        });
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsSubmitting(false);
        setFilter(Filter.All);
      });
  };

  const handleEditTodo = (currentTodo: Todo) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setLoadingTodoIds(prev => [...prev, currentTodo.id]);

    return todoService
      .updateTodo(currentTodo.id, currentTodo.title.trim())
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setServerError(false);
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToUpdate);
        setServerError(true);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== currentTodo.id));
        setIsSubmitting(false);
      });
  };

  const handleCheckedTodo = (currentTodo: Todo) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setLoadingTodoIds(prev => [...prev, currentTodo.id]);

    return todoService
      .toggleTodo(currentTodo.id, !currentTodo.completed)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToUpdate);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== currentTodo.id));
        setIsSubmitting(false);
      });
  };

  const handleCheckedAllTodos = () => {
    setErrorMessage('');
    setIsSubmitting(true);

    const editingPromises = todosToToggle.map(todo => {
      setLoadingTodoIds(prev => [...prev, todo.id]);

      return todoService.toggleTodo(todo.id, !todo.completed);
    });

    Promise.allSettled(editingPromises)
      .then(results => {
        const togglingIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            togglingIds.push(todosToToggle[index].id);
          } else {
            setErrorMessage(Error.UnableToUpdate);
          }
        });
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            togglingIds.includes(todo.id)
              ? { ...todo, completed: !todo.completed }
              : todo,
          ),
        );
      })
      .catch(error => {
        setTodos(todos);
        setIsActive(!isActive);
        setErrorMessage(Error.UnableToUpdate);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsActive(!isActive);
        setIsSubmitting(false);
      });
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all ', {
                active: allChecked,
              })}
              data-cy="ToggleAllButton"
              onClick={handleCheckedAllTodos}
            />
          )}
          <form onSubmit={submit}>
            <input
              ref={titleField}
              value={input}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTitleChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {!loading && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDeleteTodo={handleDeleteTodo}
            onEditTodo={handleEditTodo}
            onCheckedTodo={handleCheckedTodo}
            serverError={serverError}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseErrorMessage}
        />
        {errorMessage}
      </div>
    </div>
  );
};
