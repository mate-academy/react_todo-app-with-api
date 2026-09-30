/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import cn from 'classnames';
import { FilterStatus } from './types/FilterStatus';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = query.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo(title)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleToggle = (todo: Todo) => {
    setLoadingTodoIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleRename = (todoId: number, title: string) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, { title })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(err => {
        showError('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => handleToggle(todo));
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterStatus.Active) {
        return !todo.completed;
      }

      if (filter === FilterStatus.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          hasTodos={todos.length > 0}
          allTodosCompleted={allTodosCompleted}
          handleToggleAll={handleToggleAll}
          handleSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
          isAdding={tempTodo !== null}
          inputRef={inputRef}
        />

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          handleDelete={handleDelete}
          handleToggle={handleToggle}
          handleRename={handleRename}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};
