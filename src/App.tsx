/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  deleteTodo,
  addNewTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';
import { StatusFilter } from './types/StatusFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<Set<number>>(new Set());
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }

    setError(null);
    setLoading(true);
    getTodos()
      .then(todosList => setTodos(todosList))
      .catch(() => setError(ErrorMessage.NO_TODOS))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = () => {
    switch (statusFilter) {
      case StatusFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case StatusFilter.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const onErrorClose = useCallback(() => setError(null), []);

  const handleTodoDelete = (todoId: number) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() =>
        setTodos(currentList => currentList.filter(todo => todo.id !== todoId)),
      )
      .catch(err => {
        setError(ErrorMessage.UNABLE_DELETE);
        throw err;
      })
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(todoId);

          return newSet;
        });
        inputField.current?.focus();
      });
  };

  const handleTodoAdd = (todo: Todo) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(0);

      return newSet;
    });
    setTempTodo(todo);

    return addNewTodo(todo)
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(err => {
        setError(ErrorMessage.UNABLE_ADD);
        throw err;
      })
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(0);

          return newSet;
        });
        setTempTodo(null);
        setTimeout(() => inputField.current?.focus(), 0);
      });
  };

  const handleCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    if (ids.length === 0) {
      return;
    }

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.add(id));

      return newSet;
    });

    const promises = ids.map(id => {
      return deleteTodo(id);
    });

    const results = await Promise.allSettled(promises);
    const successfulIds = ids.filter(
      (_, i) => results[i].status === 'fulfilled',
    );

    if (results.some(result => result.status === 'rejected')) {
      setError(ErrorMessage.UNABLE_DELETE);
    }

    if (successfulIds.length > 0) {
      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    }

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.delete(id));

      return newSet;
    });
    inputField.current?.focus();
  };

  const handleTodoToggle = (todo: Todo) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(todo.id);

      return newSet;
    });

    const newTodo = {
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: !todo.completed,
    };

    return updateTodo(newTodo)
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            prevTodo => prevTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(err => {
        setError(ErrorMessage.UNABLE_UPDATE);
        throw err;
      })
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(todo.id);

          return newSet;
        });
      });
  };

  const handleTodoUpdate = (todo: Todo) => {
    setProcessings(prev => {
      const newSet = new Set(prev);

      newSet.add(todo.id);

      return newSet;
    });

    return updateTodo(todo)
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            prevTodo => prevTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(err => {
        setError(ErrorMessage.UNABLE_UPDATE);
        throw err;
      })
      .finally(() => {
        setProcessings(prev => {
          const newSet = new Set(prev);

          newSet.delete(todo.id);

          return newSet;
        });
      });
  };

  const onToggleAll = async () => {
    const newStatus = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    const ids = todosToUpdate.map(todo => todo.id);

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.add(id));

      return newSet;
    });

    const promises = todosToUpdate.map(todo => {
      const newTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: !todo.completed,
      };

      return updateTodo(newTodo);
    });

    const results = await Promise.allSettled(promises);
    const successfulTodos = results
      .map(res => (res.status === 'fulfilled' ? res.value : null))
      .filter(Boolean) as Todo[];

    if (results.some(result => result.status === 'rejected')) {
      setError(ErrorMessage.UNABLE_UPDATE);
    }

    setTodos(prev =>
      prev.map(todo => {
        const updated = successfulTodos.find(upd => upd.id === todo.id);

        return updated ? updated : todo;
      }),
    );

    setProcessings(prev => {
      const newSet = new Set(prev);

      ids.forEach(id => newSet.delete(id));

      return newSet;
    });
    inputField.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={onToggleAll}
            />
          )}

          <NewTodo
            setFormError={setError}
            inputField={inputField}
            onFormSubmit={handleTodoAdd}
            processings={processings}
          />
        </header>

        {todos.length > 0 && !loading && (
          <>
            <TodoList
              todosList={handleFilter()}
              handleTodoDelete={handleTodoDelete}
              tempTodo={tempTodo}
              processings={processings}
              handleTodoUpdate={handleTodoUpdate}
              handleTodoToggle={handleTodoToggle}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length + ' items left'}
              </span>

              <Filter
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(todo => todo.completed)}
                onClick={handleCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification error={error} handleErrorClose={onErrorClose} />
    </div>
  );
};
