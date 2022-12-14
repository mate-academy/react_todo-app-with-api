/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, getActiveTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
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
