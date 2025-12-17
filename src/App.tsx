import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, updateTodo } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodo } from './components/NewTodo';
import { FilterStatus } from './types/FilterStatus';
import { ERROR_MESSAGES } from './constants/errorMessages';
import { getFilteredTodos } from './utils/todoFilters';

const ERROR_DISPLAY_DURATION = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ERROR_MESSAGES.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const errorTimer = setTimeout(() => {
      setErrorMessage('');
    }, ERROR_DISPLAY_DURATION);

    return () => clearTimeout(errorTimer);
  }, [errorMessage]);

  useEffect(() => {
    if (!isLoading && !isAdding && deletingIds.length === 0) {
      newTodoInputRef.current?.focus();
    }
  }, [isLoading, isAdding, deletingIds.length]);

  const closeError = () => setErrorMessage('');

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage(ERROR_MESSAGES.EMPTY_TITLE);

      return false;
    }

    setIsAdding(true);
    setTempTodo({ id: 0, userId: USER_ID, title: trimmed, completed: false });

    let success = false;

    try {
      const created = await client.post<Todo>('/todos', {
        title: trimmed,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, created]);
      success = true;
    } catch {
      setErrorMessage(ERROR_MESSAGES.ADD_TODO);
      success = false;
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }

    return success;
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
      throw error;
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleToggle = async (todo: Todo) => {
    if (updatingIds.includes(todo.id)) {
      return;
    }

    setUpdatingIds(previousIds => [...previousIds, todo.id]);

    try {
      const updated = await updateTodo(todo);

      setTodos(previousTodos =>
        previousTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updated : currentTodo,
        ),
      );
    } catch {
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    } finally {
      setUpdatingIds(previousIds => previousIds.filter(id => id !== todo.id));
    }
  };

  const handleRename = async (todo: Todo, newTitle: string) => {
    if (updatingIds.includes(todo.id)) {
      return;
    }

    setUpdatingIds(previousIds => [...previousIds, todo.id]);

    try {
      const updated = await updateTodo({ ...todo, title: newTitle });

      setTodos(previousTodos =>
        previousTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updated : currentTodo,
        ),
      );
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
      throw error;
    } finally {
      setUpdatingIds(previousIds => previousIds.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async (completed: boolean) => {
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    if (!todosToUpdate.length) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setUpdatingIds(previousIds => [...previousIds, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo({ ...todo, completed })
        .then(() => ({ success: true, id: todo.id }))
        .catch(() => ({ success: false, id: todo.id })),
    );

    const results = await Promise.all(updatePromises);
    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    if (successfulIds.length) {
      setTodos(previousTodos =>
        previousTodos.map(todo =>
          successfulIds.includes(todo.id) ? { ...todo, completed } : todo,
        ),
      );
    }

    const hasError = results.some(result => !result.success);

    if (hasError) {
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    }

    setUpdatingIds(previousIds =>
      previousIds.filter(id => !idsToUpdate.includes(id)),
    );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(completedTodos.map(todo => todo.id));

    const deletePromises = completedTodos.map(todo =>
      client
        .delete(`/todos/${todo.id}`)
        .then(() => ({ success: true, id: todo.id }))
        .catch(() => ({ success: false, id: todo.id })),
    );

    const results = await Promise.all(deletePromises);
    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    if (successfulIds.length) {
      setTodos(previousTodos =>
        previousTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    const hasError = results.some(result => !result.success);

    if (hasError) {
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
    }

    setDeletingIds([]);
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);
  const hasTodos = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          onAdd={handleAddTodo}
          disabled={isAdding}
          todos={todos}
          onToggleAll={handleToggleAll}
          inputRef={newTodoInputRef}
          isLoading={isLoading}
        />

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deletingIds={deletingIds}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {hasTodos && (
          <Footer
            activeTodosCount={activeCount}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            hasCompletedTodos={hasCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={closeError} />
    </div>
  );
};
