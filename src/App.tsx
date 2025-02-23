/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { USER_ID, getTodos, createTodo, deleteTodo, updateTodo } from './api';

import { Todo, FilterType, ErrorType } from './types';

import { UserWarning } from './UserWarning';

import { getFilteredTodos } from './utils';

import { Error, Header, TodoList, Footer } from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterType.ALL);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  const handleCreateTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setError('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    });

    setIsLoading(prev => [...prev, 0]);

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(e => {
        setError(ErrorType.ADD);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(Boolean));
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setShouldFocusInput(true);
      })
      .catch(e => {
        setError(ErrorType.DELETE);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setIsLoading(ids => [...ids, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(currTodo => currTodo.id === todo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch(e => {
        setError(ErrorType.UPDATE);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(e => {
        setError(ErrorType.LOAD);
        setTimeout(() => setError(''), 3000);
        throw e;
      });
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
          setError={setError}
          onCreate={handleCreateTodo}
          isSubmitting={isSubmitting}
          shouldFocusInput={shouldFocusInput}
          setShouldFocusInput={setShouldFocusInput}
          onUpdate={handleUpdateTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={filterStatus}
            onChangeType={setFilterStatus}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
