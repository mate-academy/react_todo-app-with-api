/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const isCompletedTodos = useMemo(() => todos.some(todo => todo.completed),
    [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);

    return postService.createTodos({ userId, title, completed })
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch((errorAdd) => {
        setErrorMessage(Error.Add);
        throw errorAdd;
      });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newTodo: Todo = {
      id: todos.length + 1,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    if (query.length === 0) {
      setErrorMessage(Error.EmptyTitle);
    } else {
      addTodo(newTodo)
        .then(() => setQuery(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmitting(false);
        });
    }

    setTempTodo({
      ...newTodo,
    });
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
    const newStatus
      = todos.every(todo => todo.completed)
        ? FilterType.Active : FilterType.Completed;
    const updatedTodos
      = todos.map(todo => ({
        ...todo, completed: newStatus === FilterType.Completed,
      }));

    setTodos(updatedTodos);
    setStatus(newStatus);

    const changedTodos
    = updatedTodos.filter(
      (todo, index) => todo.completed !== todos[index].completed,
    );

    changedTodos.forEach((todo) => {
      postService.updateTodo(todo.id, todo)
        .catch((errorUpdate) => {
          setErrorMessage(Error.Update);
          throw (errorUpdate);
        })
        .finally(() => {
          setStatus(FilterType.All);
        });
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
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQuery}
              disabled={isSubmitting}
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
                tempTodo={tempTodo}
                isSubmitting={isSubmitting}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todoCount} items left`}
              </span>

              <TodoFilter status={status} onStatusChange={setStatus} />

              {isCompletedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={onDeleteCompleted}
                >
                  Clear completed
                </button>
              )}
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
