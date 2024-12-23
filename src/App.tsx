/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodos, getTodos, patchTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { ErrorNotification } from './components/ErrorNotification';
import { removeTodoById } from './utils/removeTodoById';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Default);
  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const addTodoField = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showError(message: Error) {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorMessage(message);
    errorTimeoutRef.current = setTimeout(
      () => setErrorMessage(Error.Default),
      3000,
    );
  }

  function handleTodoStatusChange(id: number, newStatus: boolean) {
    setLoadingTodoIds(prev => [...prev, id]);
    const updateStatus = { completed: newStatus };

    return patchTodos(id, updateStatus)
      .then(fetchedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === fetchedTodo.id ? fetchedTodo : todo,
          ),
        );
      })
      .catch(() => showError(Error.UpdateError))
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(idParametr => idParametr !== id));
      });
  }

  function setFocusOnAddInput() {
    if (addTodoField.current !== null) {
      addTodoField.current.focus();
    }
  }

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setFocusOnAddInput();
      })
      .catch(() => showError(Error.LoadError));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      setFocusOnAddInput();
    }
  }, [tempTodo]);

  function onDelete(id: number): Promise<void> {
    return deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => removeTodoById(prevTodos, id));
      })
      .catch(() => showError(Error.DeleteError));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleTodoStatusChange={handleTodoStatusChange}
          showError={showError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          addTodoField={addTodoField}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={todos}
          activeFilter={activeFilter}
          handleTodoStatusChange={handleTodoStatusChange}
          onDelete={onDelete}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          addTodoField={addTodoField}
          tempTodo={tempTodo}
          setTodos={setTodos}
          showError={showError}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setLoadingTodoIds={setLoadingTodoIds}
            onDelete={onDelete}
            setFocusOnAddInput={setFocusOnAddInput}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
