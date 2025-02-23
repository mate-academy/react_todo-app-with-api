/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.UnableLoadTodos))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const filteredTodos = getFilteredTodos(todos, selectedStatus);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingIds}
        />
        <TodoList
          todos={filteredTodos}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingIds}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isTemp={true}
            loadingIds={loadingIds}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingIds}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
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
