/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { ErrorOfTodo } from './components/ErrorOfTodo';
import { ListOfTodo } from './components/ListOfTodo';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [hasTodos, setHasTodos] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setUserTodos(todosFromServer);
        setIsEditing(false);
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage('Server error!');
      setIsEditing(false);

      setTimeout(() => {
        setHasError(false);
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  const handleErrorClose = useCallback(() => setHasError(false), []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (userTodos.length !== 0) {
      setHasTodos(true);
    } else {
      setHasTodos(false);
    }
  }, [userTodos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    handleLoadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            todos={userTodos}
            hasTodos={hasTodos}
            handleLoadTodos={handleLoadTodos}
            query={query}
            setQuery={setQuery}
            setIsEditing={setIsEditing}
          />
        </header>
        {hasTodos && (
          <ListOfTodo
            todos={userTodos}
            handleLoadTodos={handleLoadTodos}
            query={query}
            isEditing={isEditing}
          />
        )}
      </div>
      <ErrorOfTodo
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
