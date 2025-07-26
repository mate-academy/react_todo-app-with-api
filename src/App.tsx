/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { TodoList } from './Components/TodoList';
import { Notifications } from './Components/Notifications';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<Todo['id'][]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  const handleToggle = async (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      completed: editingTitle ? todo.completed : !todo.completed,
      title: editingTitle ? editingTitle.trim() : todo.title,
    };

    setProcessingIds(prev => [...prev, todo.id]);

    await updateTodo(todo.id, updatedTodo)
      .then(updated => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todo.id ? updated : t)),
        );
        setEditingTitle('');
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todo.id));
        focusInput();
      });
  };

  const handleToggleAll = async () => {
    const hasUncompleted = todos.some(todo => !todo.completed);

    const todosToUpdate = hasUncompleted
      ? todos.filter(todo => !todo.completed)
      : todos;

    await Promise.all(todosToUpdate.map(todo => handleToggle(todo)));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatus.Completed) {
      return todo.completed;
    }

    return true; // 'all'
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setProcessingIds={setProcessingIds}
          setIsAdding={setIsAdding}
          isAdding={isAdding}
          inputRef={inputRef}
          focusInput={focusInput}
          handleToggleAll={handleToggleAll}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              processingIds={processingIds}
              setProcessingIds={setProcessingIds}
              setErrorMessage={setErrorMessage}
              setTodos={setTodos}
              focusInput={focusInput}
              handleToggle={handleToggle}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
            />
          </>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            setProcessingIds={setProcessingIds}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            focusInput={focusInput}
          />
        )}
      </div>

      <Notifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
