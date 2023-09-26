import React, { useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { useTodo } from './context/TodoContext';
import { getTodos } from './api/todos';
import { useError } from './context/ErrorContext';
import { USER_ID } from './utils/variables';

export const App: React.FC = () => {
  const { todos, setTodos } = useTodo();
  const { setErrorMessage } = useError();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onHandleActive={setIsActive} />

        <TodoList
          isActive={isActive}
          onHandleActive={setIsActive}
        />

        {Boolean(todos.length) && (
          <TodoFooter />
        )}
      </div>

      <TodoNotification />
    </div>
  );
};
