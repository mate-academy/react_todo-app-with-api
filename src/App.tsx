/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { filterTodos } from './utils/getFilteredTodos';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editTodos, setEditTodos] = useState<number[]>([]);

  const filteredTodos = filterTodos(todos, filterStatus);

  const handleCreateTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage(null);
    setTempTodo({ id: 0, ...newTodo });
    setIsLoading(true);
    try {
      const createdTodo = await addTodos(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToAdd);
      throw error;
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIsLoading(true);
    setEditTodos(current => [...current, id]);
    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setEditTodos([]);
      setErrorMessage(ErrorMessage.UnableToDelete);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  const handleToggleStatus = async (id: number, completed: boolean) => {
    setIsLoading(true);
    setEditTodos(current => [...current, id]);
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);

      if (!todoToUpdate) {
        return;
      }

      const updatedTodo = await updateTodos(id, {
        completed,
        userId: todoToUpdate.userId,
        title: todoToUpdate.title,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UnableToUpdate);
    } finally {
      setEditTodos(prev => prev.filter(todoId => todoId !== id));
      setIsLoading(false);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    setIsLoading(true);
    const promises = todos
      .filter(todo => todo.completed !== newStatus)
      .map(todo => handleToggleStatus(todo.id, newStatus));

    try {
      await Promise.all(promises);
      setTodos(prev =>
        prev.map(todo =>
          todo.completed !== newStatus
            ? { ...todo, completed: newStatus }
            : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.UnableToUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTitle = async (id: number, newTitle: string) => {
    setEditTodos(current => [...current, id]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === id);

      if (!todoToUpdate) {
        return;
      }

      const updatedTodo = await updateTodos(id, {
        ...todoToUpdate,
        title: newTitle,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdate);
      throw error;
    } finally {
      setEditTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.UnableToLoad));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          handleCreateTodo={handleCreateTodo}
          isLoading={isLoading}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            editTodos={editTodos}
            onToggle={handleToggleStatus}
            onUpdate={handleUpdateTitle}
          />
        )}

        {!!todos.length && (
          <Footer
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
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
