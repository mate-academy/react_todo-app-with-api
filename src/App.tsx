/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  addTodo,
  updateTodo,
  USER_ID,
} from './utils/todos';

import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorPutting } from './components/ErrorPutting';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [selected, setSelected] = useState<Filter>(Filter.All);
  const [processings, setProcessings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const todoFieldRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    todoFieldRef.current?.focus();
  };

  useEffect(() => {
    if (processings.length === 0) {
      focusInput();
    }
  }, [processings.length]);

  async function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    try {
      setProcessings(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setProcessings(prev => prev.filter(id => id !== todoId));
    }
  }

  async function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      focusInput();

      return;
    }

    const tempId = Date.now() * -1;
    const temp = {
      id: tempId,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temp);
    setTodos(prev => [...prev, temp]);
    setProcessings(prev => [...prev, tempId]);
    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => prev.map(t => (t.id === tempId ? newTodo : t)));
      setTitle('');
    } catch (e) {
      setErrorMessage(ErrorMessage.AddTodo);
      setTodos(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setTempTodo(null);
      setProcessings(prev => prev.filter(id => id !== tempId));
    }
  }

  async function handleUpdateTodo(updatedTodo: Todo) {
    setErrorMessage('');

    setProcessings(prev => [...prev, updatedTodo.id]);

    try {
      const updatedTodoFromServer = await updateTodo(updatedTodo);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === updatedTodoFromServer.id ? updatedTodoFromServer : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
      throw error;
    } finally {
      setProcessings(prev => prev.filter(id => id !== updatedTodo.id));
    }
  }

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.id > 0 && todo.completed === allCompleted,
    );

    Promise.allSettled(
      todosToUpdate.map(todo =>
        handleUpdateTodo({ ...todo, completed: !allCompleted }),
      ),
    );
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos))
      .finally(() => focusInput());
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timingForError = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timingForError);
    }

    return;
  }, [errorMessage]);

  const filteredTodos = todos.filter(todo => {
    if (todo.id < 0) {
      return true;
    }

    if (selected === Filter.Active) {
      return !todo.completed;
    }

    if (selected === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

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
          onSubmit={handleAddTodo}
          isAdding={processings.some(id => id <= 0)}
          todoFieldRef={todoFieldRef}
          onToggleAll={handleToggleAll}
        />
        {(todos.length > 0 || tempTodo) && (
          <TodoList
            filteredTodos={filteredTodos}
            processings={processings}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selected={selected}
            setSelected={setSelected}
            onReset={clearCompleted}
          />
        )}
      </div>
      <ErrorPutting
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
