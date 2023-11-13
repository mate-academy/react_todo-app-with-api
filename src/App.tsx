/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error';
import { Filter } from './types/Filter';

const USER_ID = 11830;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [isLoading, setIsLoading] = useState(true);
  const [isHiddenClass, setIsHiddenClass] = useState(true);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        setIsHiddenClass(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    })
  ), [todos, filter]);

  useEffect(() => {
    const completed = filteredTodos.filter(todo => todo.completed);

    setCompletedTodos(completed);
  }, [filteredTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          setTodos={setTodos}
          setError={setError}
          setTempTodo={setTempTodo}
          setIsHiddenClass={setIsHiddenClass}
          todos={todos}
          completedTodos={completedTodos}
          isDisable={isDisable}
          setIsDisable={setIsDisable}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setError={setError}
          setIsHiddenClass={setIsHiddenClass}
          setIsDisable={setIsDisable}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            setFilter={setFilter}
            completedTodos={completedTodos}
            setError={setError}
            setIsDisable={setIsDisable}
            setIsHiddenClass={setIsHiddenClass}
          />
        )}
      </div>

      {!isLoading && (
        <Error
          error={error}
          isHiddenClass={isHiddenClass}
          setIsHiddenClass={setIsHiddenClass}
        />
      )}
    </div>
  );
};
