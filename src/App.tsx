import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorOfTodo } from './components/ErrorOfTodo';
import { ListOfTodo } from './components/ListOfTodo';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setUserTodos(todosFromServer);
      }
    } catch {
      setErrorMessage('Server error!');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsEditing(false);
    }
  }, []);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    handleLoadTodos();
  }, []);

  const OnEditing = (edit: boolean) => {
    setIsEditing(edit);
  };

  const OnQuery = (querya: string) => {
    setQuery(querya);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            todos={userTodos}
            handleLoadTodos={handleLoadTodos}
            query={query}
            OnQuery={OnQuery}
            OnEditing={OnEditing}
          />
        </header>
        {userTodos.length !== 0 && (
          <ListOfTodo
            todos={userTodos}
            handleLoadTodos={handleLoadTodos}
            query={query}
            isEditing={isEditing}
          />
        )}
      </div>
      {errorMessage.length > 0 && (
        <ErrorOfTodo
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
