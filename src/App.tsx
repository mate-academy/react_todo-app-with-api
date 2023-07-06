/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoApp } from './components/TodoApp';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { todosApi } from './api/todos';
import './App.scss';
import { UpdateTodo } from './types/UpdateTodo';

const USER_ID = 10914;

export const App: React.FC = () => {
  const [usersTodos, setUsersTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    todosApi.getTodos(USER_ID)
      .then(setUsersTodos)
      .catch(() => setErrorMessage('Unable to load Todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  const createTodo = async (title: string)
  : Promise<Todo | null> => {
    try {
      const newTodo = await todosApi.createTodo({
        userId: USER_ID,
        completed: false,
        title,
      });

      setUsersTodos(prevTodos => [...prevTodos, newTodo]);

      return newTodo;
    } catch (error) {
      setErrorMessage('Unable to add a todo');

      return null;
    }
  };

  const handleAddingNewTodo = useCallback(async (newTodoInput: string) => {
    if (!newTodoInput.trim()) {
      setErrorMessage('Title can\'t be empty');
    } else {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        title: newTodoInput,
        userId: USER_ID,
        completed: false,
      });

      await createTodo(newTodoInput);

      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = async (id: number)
  : Promise<boolean | null> => {
    try {
      const response = await todosApi.deleteTodo(id);
      const isDeleted = Boolean(response);

      if (isDeleted) {
        setUsersTodos((prev) => prev.filter(todo => todo.id !== id));
      }

      return isDeleted;
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      return null;
    }
  };

  const handleDeletingTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);
    setLoadingTodoId(prev => [...prev, todoId]);
    await deleteTodo(todoId);
    setLoadingTodoId([]);
    setIsLoading(false);
  }, []);

  const updateTodo = async (id: number, args: UpdateTodo)
  : Promise<Todo | null> => {
    try {
      const updatedTodo = await todosApi.updateTodo(id, args);

      setUsersTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        return updatedTodo;
      }));

      return updatedTodo;
    } catch (error) {
      setErrorMessage('Unable to update a todo');

      return null;
    }
  };

  const handleUpdatingTodo
  = useCallback(async (todoId: number, args: UpdateTodo) => {
    setIsLoading(true);
    setLoadingTodoId(prev => [...prev, todoId]);
    await updateTodo(todoId, args);
    setLoadingTodoId([]);
    setIsLoading(false);
  }, []);

  let visibleTodos = [...usersTodos];

  if (filter === 'all') {
    visibleTodos = [...usersTodos];
  }

  if (filter === 'active') {
    visibleTodos = visibleTodos.filter(todo => !todo.completed);
  }

  if (filter === 'completed') {
    visibleTodos = visibleTodos.filter(todo => todo.completed);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          handleAddingNewTodo={handleAddingNewTodo}
          isLoading={isLoading}
          isAllTodosCompleted={usersTodos.every(todo => todo.completed)}
          handleUpdatingTodo={handleUpdatingTodo}
        />

        <TodoApp
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDeletingTodo={handleDeletingTodo}
          isLoading={isLoading}
          handleUpdatingTodo={handleUpdatingTodo}
          loadingTodoId={loadingTodoId}
        />

        {(visibleTodos.length > 0 || filter !== 'all')
        && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todosNumber={usersTodos.filter(todo => !todo.completed).length}
            todos={visibleTodos}
            handleDeletingTodo={handleDeletingTodo}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
