import React, { useEffect, useState } from 'react';

import * as todosAPI from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoStatus } from './types/TodoStatus';
import { Todo } from './types/Todo';

import { useTodosState } from './contexts/TodosContext';
import { useErrorsState } from './contexts/ErrorsContext';
import { UserWarning } from './components/UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 11645;

export const App: React.FC = () => {
  const [todos, todosDispatch] = useTodosState();
  const [, setErrorMessage] = useErrorsState();

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocusedInput, setIsFocusedInput] = useState(true);
  const [filterBy, setIsFilterBy] = useState(TodoStatus.All);
  const [loading, setLoading] = useState(false);

  const triggerInputFocus = () => {
    setIsFocusedInput(prev => !prev);
  };

  useEffect(() => {
    if (USER_ID) {
      setLoading(true);
      setErrorMessage('');

      todosAPI.getTodos(USER_ID)
        .then(res => todosDispatch({ type: 'initialize', payload: res }))
        .catch(error => setErrorMessage(error.message as ErrorMessage))
        .finally(() => {
          setLoading(false);
          triggerInputFocus();
        });
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isLoading={loading}
          isFocusedInput={isFocusedInput}
          triggerInputFocus={triggerInputFocus}
          setLoading={setLoading}
          setTempTodo={setTempTodo}
        />

        {
          todos.length > 0 && (
            <>
              <TodoList
                filterBy={filterBy}
                tempTodo={tempTodo}
                triggerInputFocus={triggerInputFocus}
              />
              <TodoFooter
                setIsFilterBy={setIsFilterBy}
                triggerInputFocus={triggerInputFocus}
              />
            </>
          )
        }
      </div>

      <ErrorNotification />
    </div>
  );
};
