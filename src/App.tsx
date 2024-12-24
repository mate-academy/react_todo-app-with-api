/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/enumError';
import { FilterName } from './types/enumFilterName';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMes } from './components/ErrorMes';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Error.Default);
  const [filteredBy, setFilteredBy] = useState(FilterName.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const activeCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
        setTimeout(() => setErrorMessage(Error.Default), 3000);
      });
  }

  const filteredTodos = useMemo(() => {
    switch (filteredBy) {
      case FilterName.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterName.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filteredBy]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(Error.Default), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeCount={activeCount}
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isInputDisabled={isInputDisabled}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setIsInputDisabled={setIsInputDisabled}
          setTodos={setTodos}
        />
        {!!todos.length && (
          <TodoList
            filteredTodos={filteredTodos}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            loadingTodoId={loadingTodoId}
            tempTodo={tempTodo}
            setEditingTodoId={setEditingTodoId}
            setErrorMessage={setErrorMessage}
            setLoadingTodoId={setLoadingTodoId}
            setTodos={setTodos}
            todos={todos}
            inputRef={inputRef}
          />
        )}

        {!!todos.length && (
          <Footer
            activeCount={activeCount}
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            completedTodos={completedTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            setLoadingTodoId={setLoadingTodoId}
            setTodos={setTodos}
            inputRef={inputRef}
          />
        )}
      </div>

      <ErrorMes errorMessage={errorMessage} />
    </div>
  );
};
