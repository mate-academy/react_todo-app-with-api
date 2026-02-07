/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { USER_ID } from './api/todos';

import { Todo, FilterStatus, ErrorMessage } from './types';

import { getVisibleTodos } from './utils/getVisibleTodos';
import * as todoService from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [query, setQuery] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const haveTodos = todos.length > 0;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const isAllTodosCompleted = todos.length === completedTodosCount;

  const handleErrorReset = useCallback(() => {
    setError(ErrorMessage.None);
  }, []);

  const handleError = useCallback((message: ErrorMessage) => {
    setError(message);

    setTimeout(() => {
      setError(ErrorMessage.None);
    }, 3000);
  }, []);

  function handleUpdateTodo(originalTodo: Todo, updatedTodo: Todo) {
    setLoadingTodoIds(currentLoadingIds => [
      ...currentLoadingIds,
      updatedTodo.id,
    ]);

    setTodos(currentTodos =>
      currentTodos.map(currentTodo =>
        currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
      ),
    );

    return todoService
      .updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? todoFromServer : currentTodo,
          ),
        );
        setEditingTodoId(null);
        setEditedTodoTitle('');
      })
      .catch(() => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === originalTodo.id ? originalTodo : currentTodo,
          ),
        );
        handleError(ErrorMessage.UpdateTodoFailed);
      })
      .finally(() => {
        setLoadingTodoIds(currentLoadingIds =>
          currentLoadingIds.filter(todoId => todoId !== updatedTodo.id),
        );
      });
  }

  function handleDeleteTodo(todoId: number) {
    setLoadingTodoIds(currentLoadingIds => [...currentLoadingIds, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(() => {
        handleError(ErrorMessage.DeleteTodoFailed);
      })
      .finally(() => {
        setLoadingTodoIds(currentLoadingIds =>
          currentLoadingIds.filter(loadingId => loadingId !== todoId),
        );
        inputRef.current?.focus();
      });
  }

  function handleCreateTodo(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = query.trim();

    if (trimmedTitle.length === 0) {
      handleError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    todoService
      .createTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorMessage.AddTodoFailed);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessage.LoadTodoFailed);
      })
      .finally(() => {
        setIsLoading(false);
        inputRef.current?.focus();
      });
  }, [handleError]);

  useEffect(() => {
    if (!isLoading && !tempTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, tempTodo]);

  useEffect(() => {
    if (editingTodoId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTodoId]);

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(completedTodo => {
      handleDeleteTodo(completedTodo.id);
    });
  }

  function handleTodoToggleAll() {
    const todosToUpdate = isAllTodosCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const newCompletedStatus = !isAllTodosCompleted;

    todosToUpdate.forEach(currentTodo => {
      const updatedTodo = {
        ...currentTodo,
        completed: newCompletedStatus,
      };

      handleUpdateTodo(currentTodo, updatedTodo);
    });
  }

  function handleTodoEditing(todo: Todo) {
    const trimmedEditedTodoTitle = editedTodoTitle?.trim() || '';

    if (todo.title === trimmedEditedTodoTitle) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedEditedTodoTitle.length === 0) {
      handleDeleteTodo(todo.id);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: trimmedEditedTodoTitle,
    };

    handleUpdateTodo(todo, updatedTodo);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setEditedTodoTitle('');
    }
  }

  const visibleTodos = getVisibleTodos(todos, filter, loadingTodoIds);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          haveTodos={haveTodos}
          isAllTodosCompleted={isAllTodosCompleted}
          isLoading={isLoading}
          handleTodoToggleAll={handleTodoToggleAll}
          handleCreateTodo={handleCreateTodo}
          query={query}
          inputRef={inputRef}
          setQuery={setQuery}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          editingTodoId={editingTodoId}
          handleUpdateTodo={handleUpdateTodo}
          handleTodoEditing={handleTodoEditing}
          editInputRef={editInputRef}
          editedTodoTitle={editedTodoTitle}
          setEditedTodoTitle={setEditedTodoTitle}
          handleKeyDown={handleKeyDown}
          setEditingTodoId={setEditingTodoId}
          handleDeleteTodo={handleDeleteTodo}
        />

        {haveTodos && (
          <TodoFooter
            haveTodos={haveTodos}
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            completedTodosCount={completedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} handleErrorReset={handleErrorReset} />
    </div>
  );
};
