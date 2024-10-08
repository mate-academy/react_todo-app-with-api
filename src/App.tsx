/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getFilteredTodos } from './utils/TodosFilter';
import { Error } from './types/Error';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { setLoadingState } from './utils/loadingHandler';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const titleField = useRef<HTMLInputElement>(null);

  function createTodo(todo: Omit<Todo, 'id'>) {
    addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Error.POST);
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTempTodo({ ...todo, id: 0, loading: true });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.TITLE);

      return;
    }

    createTodo({
      title: trimmedTitle,
      completed: false,
    });
  }

  function removeTodo(todoId: number) {
    setTodos(currentTodos => setLoadingState(currentTodos, [todoId], true));

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.DELETE);
        setTodos(currentTodos =>
          setLoadingState(currentTodos, [todoId], false),
        );
      });
  }

  function clearAllCompleted() {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodos(currentTodos => setLoadingState(currentTodos, completedIds, true));

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(responses => {
        const removedIds: number[] = [];
        const hasRejected = responses.some(
          response => response.status === 'rejected',
        );

        responses.forEach((response, index) => {
          if (response.status === 'fulfilled') {
            removedIds.push(completedIds[index]);
          }
        });

        if (hasRejected) {
          setErrorMessage(Error.DELETE);
        }

        setTodos(currentTodos =>
          setLoadingState(
            currentTodos.filter(todo => !removedIds.includes(todo.id)),
            completedIds,
            false,
          ),
        );
      })
      .catch(() => setErrorMessage(Error.DELETE));
  }

  const notCompletedTodos = useMemo(() => {
    return todos?.filter(todo => !todo.completed);
  }, [todos]);

  const hasCompletedTodo = notCompletedTodos.length !== todos.length;

  const isAllCompleted = !notCompletedTodos.length;

  const handleToggleAllStatuses = () => {
    const todosToUpdate =
      !isAllCompleted && !!notCompletedTodos.length ? notCompletedTodos : todos;

    if (todosToUpdate.length) {
      setTodos(currentTodos => {
        return currentTodos.map(todo => {
          return todosToUpdate.find(loadingTodo => loadingTodo.id === todo.id)
            ? { ...todo, loading: true }
            : todo;
        });
      });
    }

    Promise.allSettled(
      todosToUpdate.map(({ id }) =>
        updateTodo(id, { completed: !isAllCompleted }),
      ),
    )
      .then(responses => {
        const hasRejected = responses.some(
          response => response.status === 'rejected',
        );

        if (hasRejected) {
          setErrorMessage(Error.PATCH);
        }

        const updatedTodos: Todo[] = [];

        responses.forEach(response => {
          if (response.status === 'fulfilled') {
            updatedTodos.push(response.value);
          }
        });

        if (updatedTodos.length) {
          setTodos(currentTodos => {
            return currentTodos.map(todo => {
              return {
                ...(updatedTodos.find(
                  updatedTodo => updatedTodo.id === todo.id,
                ) || todo),
                loading: false,
              };
            });
          });
        }
      })
      .catch(() => setErrorMessage(Error.PATCH));
  };

  useEffect(() => {
    if (titleField.current && !tempTodo) {
      titleField.current.focus();
    }
  }, [todos.length, tempTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.GET);
      });
  }, []);

  const preparedTodos = getFilteredTodos(todos, filterStatus);

  if (tempTodo) {
    preparedTodos.push(tempTodo);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllStatuses}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              disabled={!!tempTodo}
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={preparedTodos}
          setTodos={setTodos}
          deleteTodo={removeTodo}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <Footer
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            activeTodosCount={notCompletedTodos.length}
            hasCompletedTodo={hasCompletedTodo}
            clearAllCompleted={clearAllCompleted}
          />
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        message={errorMessage}
      />
    </div>
  );
};
