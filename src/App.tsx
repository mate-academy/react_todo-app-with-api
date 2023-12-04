import React, { useEffect, useMemo, useState } from 'react';
import { TodoHeader } from './Components/TodoHeader';
import { TodoList } from './Components/TodoList';
import { TodoFooter } from './Components/TodoFooter';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { Filter } from './types/Filter';
import { Notification } from './types/Notification';
import { USER_ID } from './utils/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Notification.load);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    const todosCopy = [...todos]
      .filter((todo) => {
        switch (filterType) {
          case Filter.ACTIVE: return !todo.completed;
          case Filter.COMPLETED: return todo.completed;
          default: return todo;
        }
      });

    return todosCopy;
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={preparedTodos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setLoadingIds={setLoadingIds}
        />

        {todos.length > 0 && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            loadingIds={loadingIds}
            setLoadingIds={setLoadingIds}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filterType={filterType}
            setFilterType={setFilterType}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingIds}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

    </div>
  );
};
