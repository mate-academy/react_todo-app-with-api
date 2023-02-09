/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';
import { TempTodo, Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [error, setError] = useState(ErrorType.None);
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(FilterBy.All);

  const user = useContext(AuthContext);

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const receivedTodos = await getTodos(user.id);

      setTodos(receivedTodos);
    } catch (err) {
      setError(ErrorType.LoadingError);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addTempTodo = (title: string) => {
    setTempTodo({ id: 0, title, completed: false });
  };

  const submitTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const setFiltredTodos = (filitredTodos: Todo[]) => {
    setTodos(filitredTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          submitTodo={submitTodo}
          setError={setError}
          addTempTodo={addTempTodo}
          setTempTodo={setTempTodo}
          setLoading={setIsLoading}
          setTodos={setTodos}
          todos={todos}
        />
        <TodoList
          todos={todos}
          filterBy={filterBy}
          setTodos={setFiltredTodos}
          setError={setError}
          tempTodo={tempTodo}
          addedTodoIsLoading={isLoading}
        />
        <Footer
          setStatus={setFilterBy}
          todos={todos}
          filterStatus={filterBy}
          setTodos={setTodos}
        />
      </div>

      <ErrorMessage
        errorMessage={error}
        setErrorMessage={setError}
      />
    </div>
  );
};
