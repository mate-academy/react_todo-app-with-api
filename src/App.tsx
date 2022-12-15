/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
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
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [currentInput, setCurrentInput] = useState('');

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const setErrorWithTimer = (message: string) => {
    setErrorStatus(message);
    setTimeout(() => setErrorStatus(''), 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(userTodos => {
          setVisibleTodos(userTodos);
          setAllTodos(userTodos);
        })
        .catch(() => {
          setErrorWithTimer('Unable to get a todo');
        });

      getActiveTodos(user.id)
        .then(userTodos => setActiveTodos(userTodos));
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          activeTodos={activeTodos}
          allTodos={allTodos}
          setVisibleTodos={setVisibleTodos}
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
          setVisibleTodos={setVisibleTodos}
          setErrorWithTimer={setErrorWithTimer}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <Filter
          allTodos={allTodos}
          activeTodos={activeTodos}
          setVisibleTodos={setVisibleTodos}
          visibleTodos={visibleTodos}
        />
      </div>

      <ErrorNotification
        errorStatus={errorStatus}
        setErrorStatus={setErrorStatus}
      />
    </div>
  );
};
