/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { FilterType } from './types/FilterType';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoError } from './components/TodoError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11260;

const getVisibleTodos = (todos: Todo[], status: FilterType) => {
  switch (status) {
    case FilterType.Completed:
      return todos.filter(todo => todo.completed);
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [status, setStatus] = useState(FilterType.All);
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

  const todoCount = useMemo(() => todos.filter(todo => !todo.completed).length,
    [todos]);

  const completedTodoCount = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    const newTodo = { title: query, userId: USER_ID, completed: false };

    setTempTodo({ ...newTodo, id: 0 });
    setLoadingIds((ids) => [...ids, 0]);

    postService.createTodo(newTodo)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setTempTodo(null);
          })
          .finally(() => {
            setLoadingIds((ids) => ids.filter(id => id !== 0));
          });
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      });

    setQuery('');
  };

  const onDeleteTodo = (todoId: number) => {
    setLoadingIds((ids) => [...ids, todoId]);
    postService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => {
        setLoadingIds((ids) => ids.filter(id => id !== todoId));
      });
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDeleteTodo(todo.id);
    });
  };

  const handleToggleAll = () => {
    const uncompletedTodos = todos.filter(todo => todo.completed === false);
    const uncompletedTodosIds = uncompletedTodos.map(todo => todo.id);

    if (uncompletedTodos.length === 0) {
      setLoadingIds(currIds => [...currIds, ...todos.map(todo => todo.id)]);

      Promise.all(todos.map(todo => {
        return postService.updateTodo(todo.id, { completed: !todo.completed });
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

    setLoadingIds(currIds => [...currIds, ...uncompletedTodosIds]);

    Promise.all(uncompletedTodos.map(todo => {
      return postService.updateTodo(todo.id, { completed: !todo.completed });
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
              aria-label="btn"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: completedTodoCount !== 0,
              })}
              onClick={() => handleToggleAll()}
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

        {todos.length !== 0 && (
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
                setTodos={setTodos}
                loadingIds={loadingIds}
                setLoadingIds={setLoadingIds}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todoCount} items left`}
              </span>

              <TodoFilter status={status} setStatus={setStatus} />

              <button
                type="button"
                className={cn('todoapp__clear-completed',
                  { 'is-invisible': completedTodoCount === 0 })}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <TodoError error={errorMessage} onErrorChange={setErrorMessage} />
      )}
    </div>
  );
};
