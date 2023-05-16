/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { useTodoContext } from './context/TodoContext';
import { getTodos } from './api/todos';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { FooterFilter } from './components/FooterFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { Header } from './components/Header';

const USER_ID = 10407;

export const App: React.FC = () => {
  const {
    todos,
    error,
    setTodos,
    setError,
  } = useTodoContext();

  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setCompletedTodos(todos?.filter(todo => !todo.completed));
  }, [todos]);

  const loadTodos = async () => {
    try {
      setError(null);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.LOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${completedTodos.length} items left`}
              </span>

              <FooterFilter />
            </footer>

          </>
        )}
      </div>

      {error && <ErrorMessage />}
    </div>
  );
};
