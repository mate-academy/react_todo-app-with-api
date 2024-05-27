/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoItem } from './components/TodoItem/TodoItem';
import { ErrorNotification } from './components/Error/Error';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.UnableLoadTodos))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const filteredTodos = getVisibleTodos(todos, selectedStatus);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loadingIds={loadingId}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingId}
        />
        <TodoList
          todos={filteredTodos}
          loadingIds={loadingId}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingId}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isTemp={true}
            loadingIds={loadingId}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingId}
          />
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingId}
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
