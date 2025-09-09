/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TempTodoItem } from './components/TempTodoItem';
import { showError } from './utils/showError';
import { TodoHeader } from './components/TodoHeader';
import { TodosList } from './components/ListOfTodos';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessages, Filter } from './components/Enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<Record<number, boolean>>(
    {},
  );
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = [...todos].filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => showError(setError, ErrorMessages.LOAD))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      showError(setError, ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo: Todo = { id: 0, userId: USER_ID!, title, completed: false };

    setIsAdding(true);
    setTempTodo(newTodo);

    try {
      const createdTodo = await addTodo(title);

      setTodos(prev => [...prev, createdTodo]);
      setNewTitle('');
    } catch {
      showError(setError, ErrorMessages.ADD);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setProcessingIds(prev => ({ ...prev, [id]: true }));
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError(setError, ErrorMessages.DELETE);
    } finally {
      setProcessingIds(prev => ({ ...prev, [id]: false }));
      inputRef.current?.focus();
    }
  };

  const handleClearAllCompleted = async () => {
    const completedIds = completedTodos.map(todo => todo.id);
    let hasError = false;

    for (const id of completedIds) {
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        hasError = true;
      }
    }

    if (hasError) {
      showError(setError, ErrorMessages.DELETE);
    }

    inputRef.current?.focus();
  };

  const setIsUpdating = (id: number, value: boolean) => {
    setProcessingIds(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setIsUpdating(id, true);
    try {
      const updated = await updateTodo(id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      showError(setError, ErrorMessages.UPDATE);
    } finally {
      setIsUpdating(id, false);
    }
  };

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    for (const todo of todos) {
      if (todo.completed !== !allCompleted) {
        await handleToggleTodo(todo.id);
      }
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const saveEditing = async (todo: Todo) => {
    const title = editingTitle.trim();

    if (!title) {
      try {
        await handleDeleteTodo(todo.id);
      } catch {
        showError(setError, ErrorMessages.DELETE);
      }

      return;
    }

    if (title === todo.title) {
      cancelEditing();

      return;
    }

    setIsUpdating(todo.id, true);
    try {
      const updated = await updateTodo(todo.id, { ...todo, title });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      cancelEditing();
    } catch {
      showError(setError, ErrorMessages.UPDATE);
    } finally {
      setIsUpdating(todo.id, false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          activeTodos={activeTodos}
          loading={isLoading}
          newTitle={newTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          handleAddTodo={handleAddTodo}
          handleToggleAllTodos={handleToggleAllTodos}
          setNewTitle={setNewTitle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodosList
            loading={isLoading}
            visibleTodos={visibleTodos}
            processingIds={processingIds}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            editInputRef={editInputRef}
            setEditingTitle={setEditingTitle}
            startEditing={startEditing}
            saveEditing={saveEditing}
            cancelEditing={cancelEditing}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
          />

          {tempTodo && (
            <TempTodoItem
              tempTodo={tempTodo}
              isAdding={isAdding}
              processingIds={processingIds}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTodo={handleDeleteTodo}
            />
          )}
        </section>

        <Footer
          todos={todos}
          activeTodos={activeTodos}
          completedTodos={completedTodos}
          filter={filter}
          setFilter={setFilter}
          handleClearAllCompleted={handleClearAllCompleted}
        />
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
