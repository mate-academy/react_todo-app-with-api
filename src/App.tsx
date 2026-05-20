/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorMessages } from './types/ErrorMessage';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodoId, setTempTodoId] = useState(0);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [updatingTodosId, setUpdatingTodosId] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NoError,
  );
  const [editingTodoId, setEditingTodoId] = useState(0);
  const newTodoInput = useRef<HTMLInputElement>(null);
  const editingTodoInput = useRef<HTMLInputElement>(null);
  const incompleteTodos = todos.filter(
    todo => !todo.completed && todo.id !== tempTodoId,
  );
  const completedTodos = todos.filter(todo => todo.completed);
  const filteredTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    const tempTodo: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsSending(true);
    setTempTodoId(tempTodo.id);
    setUpdatingTodosId(prev => [...prev, tempTodo.id]);
    setTodos(prev => [...prev, tempTodo]);

    try {
      const createdTodo = await postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === tempTodo.id ? createdTodo : todo)),
      );

      setNewTodoTitle('');
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== tempTodo.id));
      setErrorMessage(ErrorMessages.AddTodo);
    } finally {
      setIsSending(false);
      setTempTodoId(0);
      setUpdatingTodosId(prev => prev.filter(todoId => todoId !== tempTodo.id));
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setUpdatingTodosId(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      newTodoInput.current?.focus();
      setTodos(prev => prev.filter(delTodo => delTodo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessages.DeleteTodo);
    } finally {
      setUpdatingTodosId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleToggleTodo = async (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);

    setUpdatingTodosId(prev => [...prev, id]);

    try {
      const updatedTodo = await patchTodo(id, {
        completed: !currentTodo?.completed,
      });

      setTodos(prev => [
        ...prev.map(todo => (todo.id === id ? updatedTodo : todo)),
      ]);
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateTodo);
    } finally {
      setUpdatingTodosId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = () => {
    if (todos.length > completedTodos.length) {
      todos
        .filter(todo => todo.completed === false)
        .forEach(todo => handleToggleTodo(todo.id));
    } else {
      todos.forEach(todo => handleToggleTodo(todo.id));
    }
  };

  const handleEditTodo = async (id: number, title: string) => {
    const trimValue = editingTodoInput.current?.value.trim();

    if (title === trimValue) {
      editingTodoInput.current?.blur();

      return;
    }

    if (trimValue?.length === 0) {
      handleDeleteTodo(id);

      return;
    }

    setUpdatingTodosId(prev => [...prev, id]);

    try {
      const updatedTodo = await patchTodo(id, {
        title: trimValue,
      });

      setTodos(prev => [
        ...prev.map(todo => (todo.id === id ? updatedTodo : todo)),
      ]);
      setEditingTodoId(0);
    } catch (error) {
      setErrorMessage(ErrorMessages.UpdateTodo);
    } finally {
      setUpdatingTodosId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorMessages.LoadTodos);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const hideErrorTimeout = window.setTimeout(() => {
      setErrorMessage(ErrorMessages.NoError);
    }, 3000);

    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, [errorMessage]);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [isSending]);

  useEffect(() => {
    if (!editingTodoId) {
      return;
    }

    editingTodoInput.current?.focus();
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          setNewTodoTitle={setNewTodoTitle}
          todosLength={todos.length}
          isSending={isSending}
          newTodoInput={newTodoInput}
          newTodoTitle={newTodoTitle}
          completedTodos={completedTodos}
        ></Header>

        <Main
          onDeleteTodo={handleDeleteTodo}
          onSetEditingTodoId={setEditingTodoId}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          todosLength={todos.length}
          filteredTodos={filteredTodos}
          updatingTodosId={updatingTodosId}
          editingTodoId={editingTodoId}
          tempTodoId={tempTodoId}
          editingTodoInput={editingTodoInput}
        />

        {!!todos.length && (
          <Footer
            onSelectFilter={setSelectedFilter}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
            completedTodos={completedTodos}
            incompleteTodosLength={incompleteTodos.length}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseError={setErrorMessage}
      />
    </div>
  );
};
