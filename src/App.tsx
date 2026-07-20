/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isAdding = tempTodo !== null;

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = completedTodos.length > 0;

  const areAllTodosCompleted = hasTodos && todos.every(todo => todo.completed);

  const isClearingCompleted = completedTodos.some(todo =>
    processingTodoIds.includes(todo.id),
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const addProcessingIds = (todoIds: number[]) => {
    setProcessingTodoIds(currentIds =>
      Array.from(new Set([...currentIds, ...todoIds])),
    );
  };

  const removeProcessingIds = (todoIds: number[]) => {
    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !todoIds.includes(id)),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    setErrorMessage('');

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      focusInput();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const createdTodo = await createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number): Promise<boolean> => {
    setErrorMessage('');
    addProcessingIds([todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Delete);

      return false;
    } finally {
      removeProcessingIds([todoId]);
      focusInput();
    }
  };

  const handleUpdate = async (
    todoId: number,
    changes: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<boolean> => {
    setErrorMessage('');
    addProcessingIds([todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, changes);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Update);

      return false;
    } finally {
      removeProcessingIds([todoId]);
    }
  };

  const handleToggle = (todoId: number, completed: boolean) => {
    return handleUpdate(todoId, { completed });
  };

  const handleRename = (todoId: number, newTitle: string) => {
    return handleUpdate(todoId, {
      title: newTitle,
    });
  };

  const handleToggleAll = async () => {
    if (!hasTodos) {
      return;
    }

    const newCompletedStatus = !areAllTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');

    const todoIds = todosToUpdate.map(todo => todo.id);

    addProcessingIds(todoIds);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: newCompletedStatus,
        }),
      ),
    );

    const updatedTodos = new Map<number, Todo>();

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        updatedTodos.set(todosToUpdate[index].id, result.value);
      }
    });

    setTodos(currentTodos =>
      currentTodos.map(todo => {
        return updatedTodos.get(todo.id) || todo;
      }),
    );

    const hasUpdateError = results.some(result => result.status === 'rejected');

    if (hasUpdateError) {
      setErrorMessage(ErrorMessage.Update);
    }

    removeProcessingIds(todoIds);
  };

  const handleClearCompleted = async () => {
    const todoIds = completedTodos.map(todo => todo.id);

    if (todoIds.length === 0) {
      return;
    }

    setErrorMessage('');
    addProcessingIds(todoIds);

    const results = await Promise.allSettled(
      todoIds.map(todoId => deleteTodo(todoId)),
    );

    const deletedTodoIds = new Set<number>();

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        deletedTodoIds.add(todoIds[index]);
      }
    });

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedTodoIds.has(todo.id)),
    );

    const hasDeletionError = results.some(
      result => result.status === 'rejected',
    );

    if (hasDeletionError) {
      setErrorMessage(ErrorMessage.Delete);
    }

    removeProcessingIds(todoIds);
    focusInput();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={[
                'todoapp__toggle-all',
                areAllTodosCompleted ? 'active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isAdding}
              onChange={event => {
                setTitle(event.target.value);
              }}
              autoFocus
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingTodoIds={processingTodoIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {hasTodos && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            isClearingCompleted={isClearingCompleted}
            selectedFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => {
          setErrorMessage('');
        }}
      />
    </div>
  );
};
