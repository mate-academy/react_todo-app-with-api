/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos, getActiveTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
  const [isLoading, setIsLoading] = useState('');
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [errorStatus, setErrorStatus] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [filter, setFilter] = useState('all');

  const visibleTodos = useMemo(() => {
    let result = allTodos;

    if (allTodos) {
      if (filter === 'active') {
        result = allTodos.filter(todo => !todo.completed);
      }

      if (filter === 'completed') {
        result = allTodos.filter(todo => todo.completed);
      }
    }

    return result;
  }, [filter, allTodos]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const setErrorWithTimer = useCallback((message: string) => {
    setErrorStatus(message);
    setTimeout(() => setErrorStatus(''), 3000);
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(userTodos => {
          setAllTodos(userTodos);
        })
        .catch(() => {
          setErrorWithTimer('Unable to get a todo');
        });

      getActiveTodos(user.id)
        .then(userTodos => setActiveTodos(userTodos));
    }
  }, []);

  useEffect(() => {
    if (user) {
      getActiveTodos(user.id)
        .then(userTodos => setActiveTodos(userTodos));
    }
  }, [allTodos, visibleTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          activeTodos={activeTodos}
          allTodos={allTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          setErrorWithTimer={setErrorWithTimer}
          setAllTodos={setAllTodos}

        />
        <TodoList
          visibleTodos={visibleTodos}
          currentInput={currentInput}
          setErrorWithTimer={setErrorWithTimer}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setAllTodos={setAllTodos}
        />

        <Filter
          allTodos={allTodos}
          activeTodos={activeTodos}
          setFilter={setFilter}
          selectedFilter={filter}
          setAllTodos={setAllTodos}
        />
      </div>

      <ErrorNotification
        errorStatus={errorStatus}
        setErrorStatus={setErrorStatus}
      />
    </div>
  );
};
