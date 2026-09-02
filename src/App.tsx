import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Todo } from './types/Todo';
import { Errors } from './types/ErrorType';
import { Filters } from './types/FilterStatus';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [statuses, setStatuses] = useState<Filters>(Filters.All);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);

  const countActiveTodos = todos?.filter(todo => !todo.completed).length;

  const countCompletedTodos = todos?.filter(todo => todo.completed).length;

  const allTodosCompleted = countCompletedTodos === todos.length;

  const showActiveButton = todos.length > 0;

  const field = useRef<HTMLInputElement>(null);

  const handleAddTodo = useCallback(async (title: string) => {
    const tempTodoId = { id: 0, title, completed: false, userId: USER_ID };

    setTempTodo(tempTodoId);

    try {
      const createdTodo = await addTodo({ title, completed: false });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setNewTitle('');
    } catch (error) {
      setErrorMessage(Errors.UnableToAdd);
      //
      setTimeout(() => setErrorMessage(Errors.Default), 3000);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Errors.UnableToDelete);
    }

    setLoading(prev => prev.filter(id => id !== todoId));
    field.current?.focus();
  }, []);

  const onRemoveAllCompleted = useCallback(async () => {
    const allTodosCompletedFiltered = todos.filter(todo => todo.completed);

    allTodosCompletedFiltered.forEach(todo => handleRemoveTodo(todo.id));
  }, [todos, handleRemoveTodo]);

  const handleToggleTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      setLoading(prev => [...prev, todoId]);

      try {
        await updateTodo({ id: todoId, completed });
        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, completed: completed } : todo,
          ),
        );
      } catch (error) {
        setErrorMessage(Errors.UnableToUpdate);
        setTimeout(() => setErrorMessage(Errors.Default), 3000);
      } finally {
        setLoading(prev => prev.filter(id => id !== todoId));
      }
    },
    [],
  );

  const handleToggleAllTodos = useCallback(async () => {
    if (countActiveTodos > 0) {
      const filteredTodos = todos.filter(todo => !todo.completed);

      filteredTodos.forEach(todo => handleToggleTodo(todo.id, true));
    } else {
      todos.forEach(todo => handleToggleTodo(todo.id, false));
    }
  }, [todos, handleToggleTodo, countActiveTodos]);

  const handleRenameTodo = useCallback(
    async (todoId: number, title: string) => {
      setLoading(prev => [...prev, todoId]);

      try {
        await updateTodo({ id: todoId, title: title.trim() });
        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, title: title.trim() } : todo,
          ),
        );
      } catch (error) {
        setErrorMessage(Errors.UnableToUpdate);
        setTimeout(() => setErrorMessage(Errors.Default), 3000);
      } finally {
        setLoading(prev => prev.filter(id => id !== todoId));
        setRenamingId(null);
      }
    },
    [setTodos, setLoading, setErrorMessage, setRenamingId],
  );

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.UnableToLoad);
        setTimeout(() => setErrorMessage(Errors.Default), 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (statuses) {
      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          setErrorMessage={setErrorMessage}
          onAddTodo={handleAddTodo}
          field={field}
          handleToggleAllTodos={handleToggleAllTodos}
          allTodosCompleted={allTodosCompleted}
          showActiveButton={showActiveButton}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onRemoveTodo={handleRemoveTodo}
              loading={loading}
              tempTodo={tempTodo}
              handleToggleTodo={handleToggleTodo}
              renamingId={renamingId}
              setRenamingId={setRenamingId}
              handleRenameTodo={handleRenameTodo}
            />
            <Footer
              statuses={statuses}
              setStatuses={setStatuses}
              countActiveTodos={countActiveTodos}
              countCompletedTodos={countCompletedTodos}
              onRemoveAllCompleted={onRemoveAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
