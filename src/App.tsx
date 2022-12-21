/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  setIsLoadingContext,
  functonsContext,
} from './components/Context/context';
import { Todo } from './types/Todo';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [errorStatus, setErrorStatus] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [filter, setFilter] = useState(Filters.all);

  const visibleTodos = useMemo(() => {
    const result = allTodos;

    if (allTodos) {
      switch (filter) {
        case Filters.active:
          return result?.filter(todo => !todo.completed) || null;

        case Filters.completed:
          return result?.filter(todo => todo.completed) || null;

        default:
          return result;
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

  const loadUserTodos = useCallback(async () => {
    if (user) {
      const userTodos = await getTodos(user.id);
      const userActiveTodos = userTodos.filter(todo => !todo.completed);

      try {
        setAllTodos(userTodos);
        setActiveTodos(userActiveTodos);
      } catch {
        setErrorWithTimer('Unable to get a todo');
      }
    }
  }, [user]);

  const onFocusing = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  useEffect(() => {
    onFocusing();

    loadUserTodos();
  }, [user]);

  useEffect(() => {
    if (currentInput === '') {
      onFocusing();
    }
  }, [currentInput]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <setIsLoadingContext.Provider value={setIsLoading}>
          <NewTodo
            newTodoField={newTodoField}
            activeTodos={activeTodos}
            allTodos={allTodos}
            isLoading={isLoading}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            setErrorWithTimer={setErrorWithTimer}
            loadUserTodos={loadUserTodos}
          />
          <functonsContext.Provider value={{
            setErrorWithTimer,
            loadUserTodos,
          }}
          >
            <TodoList
              visibleTodos={visibleTodos}
              currentInput={currentInput}
              isLoading={isLoading}
            />
          </functonsContext.Provider>

          <Filter
            allTodos={allTodos}
            activeTodos={activeTodos}
            setFilter={setFilter}
            selectedFilter={filter}
            setAllTodos={setAllTodos}
          />
        </setIsLoadingContext.Provider>
      </div>

      <ErrorNotification
        errorStatus={errorStatus}
        setErrorStatus={setErrorStatus}
      />
    </div>
  );
};
