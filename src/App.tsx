/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import './styles/index.scss';
import {
  getTodos,
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/todo';
import { useState } from 'react';
import cn from 'classnames';
import { TodoFilter } from './types/filters';
import { ErrorTypes } from './types/errorTypes';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { NewTodo } from './components/NewTodo';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const receivedTodos = await getTodos();

        setTodos(receivedTodos);
      } catch {
        setError(ErrorTypes.LoadTodos);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const visibleTodos = getFilteredTodos(todos, filter);

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    const title = newTodo.trim();

    if (title === '') {
      setError(ErrorTypes.EmptyTitle);

      return;
    }

    setIsAdding(true);

    const newTodoItem: Todo = {
      title: title,
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    setTempTodo(newTodoItem);

    try {
      const createdNewTodo = await addTodo(newTodoItem);

      setTodos(prevTodos => [...prevTodos, createdNewTodo]);
      setNewTodo('');
    } catch {
      setError(ErrorTypes.AddTodo);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);

    if (!todoToDelete) {
      return;
    }

    setDeletingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorTypes.DeleteTodo);
    } finally {
      setDeletingTodoIds(prevTodos =>
        prevTodos.filter(foundId => foundId !== id),
      );
    }

    inputRef.current?.focus();
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsCompleted = completedTodos.map(todo => todo.id);

    if (idsCompleted.length === 0) {
      return;
    }

    setDeletingTodoIds(prevTodoIds => [...prevTodoIds, ...idsCompleted]);

    Promise.allSettled(idsCompleted.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds: number[] = [];
        let hasRejected = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(idsCompleted[index]);
          } else {
            hasRejected = true;
          }
        });

        if (successfulIds.length > 0) {
          setTodos(prevTodoIds =>
            prevTodoIds.filter(todo => !successfulIds.includes(todo.id)),
          );
        }

        if (hasRejected) {
          setError(ErrorTypes.DeleteTodo);
        }
      })
      .finally(() => {
        setDeletingTodoIds(prevTodoIds =>
          prevTodoIds.filter(id => !idsCompleted.includes(id)),
        );
      });

    inputRef.current?.focus();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    try {
      const updatedTodo = await updateTodo(id, updates);

      setTodos(prevTodoIds =>
        prevTodoIds.map(todo =>
          todo.id === id ? { ...todo, ...updates } : todo,
        ),
      );

      return updatedTodo;
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      setError(ErrorTypes.UpdateTodo);
      throw error;
    } finally {
      setUpdatingTodoIds(prevTodoIds =>
        prevTodoIds.filter(updatingId => updatingId !== id),
      );
    }
  };

  const handleToggleAll = () => {
    const targetStatus = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    todosToUpdate.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: targetStatus });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            ref={inputRef}
            onChange={setNewTodo}
            onSubmit={handleAddTodo}
            newTodo={newTodo}
            disabled={isAdding}
          />
        </header>

        {isLoading && <div className="loader"></div>}

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          onUpdateTodo={handleUpdateTodo}
          editingId={editingId}
          onEditingIdChange={setEditingId}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            todos={todos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { ' hidden': !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
