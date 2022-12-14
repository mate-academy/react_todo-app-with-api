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
  const [errorStatus, setErrorStatus] = useState('');
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(0);

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
          setIsAdding={setIsAdding}
          isAdding={isAdding}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          setErrorWithTimer={setErrorWithTimer}

        />
        <TodoList
          visibleTodos={visibleTodos}
          isAdding={isAdding}
          currentInput={currentInput}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          setVisibleTodos={setVisibleTodos}
          setErrorWithTimer={setErrorWithTimer}
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
