import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Footer, ErrorNotification, Header, TodoList } from './components';
import { UpdateTodo, FilterBy, ErrorMessage, Todo } from './types/Todo';
import {
  useError,
  useFilteredTodos,
  useCreateTodo,
  useUpdateTodo,
  useClearCompleted,
} from './hooks';

const FOCUS_INPUT_DELAY = 0;

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingItemIds, setLoadingItemIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const { hideError, showError } = useError(setErrorMessage);

  const { visibleTodos, activeTodosAmount } = useFilteredTodos(todos, filterBy);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), FOCUS_INPUT_DELAY);
  }, []);

  const loadTodos = useCallback(() => {
    hideError();
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => setTempTodo(null));
  }, [showError, hideError]);

  const finalizeAction = useCallback(
    (idsToRemove: number[] = []) => {
      setLoadingItemIds(prev => prev.filter(id => !idsToRemove.includes(id)));
      focusInput();
    },
    [focusInput],
  );

  const createTodo = useCreateTodo({
    setTodos,
    setTitle,
    setTempTodo,
    setLoadingItemIds,
    showError,
    hideError,
    finalizeAction,
  });

  const updateTodo = useUpdateTodo({
    setTodos,
    setLoadingItemIds,
    showError,
    hideError,
    finalizeAction,
  });

  const deleteTodo = useCallback(
    (id: number) => {
      hideError();
      setLoadingItemIds(prev => [...prev, id]);

      todoService
        .deleteTodo(id)
        .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
        .catch(() => showError(ErrorMessage.Delete))
        .finally(() => finalizeAction([id]));
    },
    [showError, hideError, finalizeAction],
  );

  const clearCompletedTodos = useClearCompleted({
    todos,
    setTodos,
    setLoadingItemIds,
    showError,
    hideError,
    focusInput,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        showError(ErrorMessage.TitleValidation);

        return;
      }

      createTodo(trimmedTitle);
    },
    [title, createTodo, showError],
  );

  const handleTodosToggle = useCallback(() => {
    const todosToUpdate = !activeTodosAmount
      ? todos
      : todos.filter(todo => !todo.completed);

    Promise.all(
      todosToUpdate.map(todo => updateTodo(todo, UpdateTodo.Status)),
    ).catch(() => {
      showError(ErrorMessage.Update);
    });
  }, [todos, showError, activeTodosAmount, updateTodo]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={title}
          onTitleChange={setTitle}
          loadingItemIds={loadingItemIds}
          handleTodosToggle={handleTodosToggle}
          activeTodosAmount={activeTodosAmount}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingItemIds={loadingItemIds}
          handleDelete={deleteTodo}
          handleUpdate={updateTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeTodosAmount={activeTodosAmount}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideError={hideError} />
    </div>
  );
};
