/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodos,
  deleteTodos,
  updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        setError('');

        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (e) {
        setError(ErrorMessage.UNABLE_TO_LOAD);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setError('');
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }

    return undefined;
  }, [error]);

  useEffect(() => {
    if (!isAddingTodo && newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [isAddingTodo]);

  const hideErrorNotification = () => {
    setError('');
  };

  const handleTodoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    try {
      setIsAddingTodo(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      const newTodo = await createTodos(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
    } catch (e) {
      setError(ErrorMessage.UNABLE_TO_ADD);
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodos(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError(ErrorMessage.UNABLE_TO_DELETE);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleStatusChange = async (todoId: number, completed: boolean) => {
    setUpdatingTodoIds(prev => [...prev, todoId]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      const updatedTodo = await updateTodos({
        ...todoToUpdate,
        completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (e) {
      setError(ErrorMessage.UNABLE_TO_UPDATE);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todoId));

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleTitleChange = async (todoId: number, title: string) => {
    if (title.trim() === '') {
      handleDeleteTodo(todoId);

      return;
    }

    setUpdatingTodoIds(prev => [...prev, todoId]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      const updatedTodo = await updateTodos({
        ...todoToUpdate,
        title,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (e) {
      setError(ErrorMessage.UNABLE_TO_UPDATE);

      return;
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todoId));

      if (!error && newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setUpdatingTodoIds(prev => [
      ...prev,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      let hasError = false;

      const updatePromises = todosToUpdate.map(async todo => {
        try {
          const updatedTodo = await updateTodos({
            ...todo,
            completed: newStatus,
          });

          return updatedTodo;
        } catch (e) {
          hasError = true;

          return null;
        }
      });

      const results = await Promise.all(updatePromises);
      const updatedTodos = results.filter(todo => todo !== null) as Todo[];

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = updatedTodos.find(t => t.id === todo.id);

          return updatedTodo || todo;
        }),
      );

      if (hasError) {
        setError(ErrorMessage.UNABLE_TO_UPDATE);
      }
    } finally {
      setUpdatingTodoIds([]);

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingTodoIds(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    try {
      let hasError = false;

      const deletePromises = completedTodos.map(async todo => {
        try {
          await deleteTodos(todo.id);

          return todo.id;
        } catch (e) {
          hasError = true;

          return null;
        }
      });

      const results = await Promise.all(deletePromises);

      const deletedIds = results.filter(id => id !== null) as number[];

      setTodos(prevTodos =>
        prevTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      if (hasError) {
        setError(ErrorMessage.UNABLE_TO_DELETE);
      }
    } finally {
      setDeletingTodoIds(prev =>
        prev.filter(id => !completedTodos.find(todo => todo.id === id)),
      );

      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

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
              className={cn('todoapp__toggle-all', { active: areAllCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={newTodoFieldRef}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          isLoading={isLoading}
          onDelete={handleDeleteTodo}
          onStatusChange={handleStatusChange}
          onTitleChange={handleTitleChange}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          tempTodo={tempTodo}
          error={error}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
            </span>

            <TodoFilter
              filterStatus={filterStatus}
              onChange={setFilterStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <ErrorNotification onClose={hideErrorNotification} error={error} />
    </div>
  );
};
