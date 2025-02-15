import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [visibleTodos, setVisibleTodos] = useState([...todos]);

  const handleError = (message: string) => {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => handleError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (todos.length === 0) {
      setVisibleTodos([]);
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setErrorMessage={setErrorMessage}
          todos={todos}
          handleError={handleError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        {loading && (
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', 'is-active')}
          >
            <div className="modal-background" />
            <div className="loader" />
          </div>
        )}

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          handleError={handleError}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            onSelectChange={setVisibleTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
