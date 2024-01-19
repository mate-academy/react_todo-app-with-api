/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTypes';
import { Error } from './utils/errorUtils';
import { getTodos } from './api/todos';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/FilterTodo';
import { TodoError } from './components/TodoError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11707;

const getVisibleTodos = (todos: Todo[], status: FilterType) => {
  return todos.filter(todo => {
    switch (status) {
      case FilterType.Completed:
        return todo.completed;

      case FilterType.Active:
        return !todo.completed;

      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  const visibleTodos = useMemo(() => getVisibleTodos(todos, status),
    [todos, status]);

  const todosCount = useMemo(() => todos.filter(todo => !todo.completed).length,
    [todos]);

  const isCompletedTodos = useMemo(() => todos.some(todo => todo.completed),
    [todos]);

  const completedTodoCount = todos.filter(todo => todo.completed).length;

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    const newTodo = {
      title: query,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setLoadingIds((ids) => [...ids, 0]);

    postService.createTodo(newTodo)
      .then((value) => {
        setTodos(currentTodos => [...currentTodos, value]);
        setTempTodo(null);
      })
      .catch((error) => {
        setErrorMessage(Error.Add);
        throw error;
      })
      .finally(() => {
        setLoadingIds((ids) => ids.filter(id => id !== 0));
      });

    setQuery('');
  };

  const onDeleteTodo = (todoId: number) => {
    setLoadingIds((ids) => [...ids, todoId]);
    postService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setLoadingIds((ids) => ids.filter(id => id !== todoId)));
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDeleteTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = () => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);
    const uncompletedTodosIds = uncompletedTodos.map(todo => todo.id);

    if (uncompletedTodos.length === 0) {
      setLoadingIds(currentIds => [
        ...currentIds,
        ...todos.map(
          todo => todo.id,
        )]);

      Promise.all(todos.map(todo => {
        return postService.updateTodo(todo.id, {
          completed: !todo.completed,
        });
      }))
        .then(() => {
          getTodos(USER_ID)
            .then((value) => {
              setTodos(value);
              setLoadingIds([]);
            })
            .catch(() => {
              setErrorMessage(Error.Load);
            });
        })
        .catch(() => {
          setErrorMessage(Error.Update);
        });

      return;
    }

    setLoadingIds(currentIds => [...currentIds, ...uncompletedTodosIds]);

    Promise.all(uncompletedTodos.map(todo => {
      return postService.updateTodo(todo.id, {
        completed: !todo.completed,
      });
    }))
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
          })
          .catch(() => {
            setErrorMessage(Error.Load);
          })

          .finally(() => {
            setLoadingIds([]);
          });
      })
      .catch(() => {
        setErrorMessage(Error.Update);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: completedTodoCount !== 0,
              })}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQuery}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              loadingIds={loadingIds}
              setTodos={setTodos}
              setLoadingIds={setLoadingIds}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                onDeleteTodo={onDeleteTodo}
                loadingIds={loadingIds}
                setTodos={setTodos}
                setLoadingIds={setLoadingIds}
                todos={visibleTodos}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {todosCount === 1 ? ('1 item left')
                  : (`${todosCount} items left`)}
              </span>

              <TodoFilter
                status={status}
                onStatusChange={setStatus}
              />

              <button
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  { 'todoapp__clear-completed--disabled': !isCompletedTodos },
                )}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {
        errorMessage && (
          <TodoError
            error={errorMessage}
            onErrorChange={setErrorMessage}
          />
        )
      }
    </div>
  );
};
