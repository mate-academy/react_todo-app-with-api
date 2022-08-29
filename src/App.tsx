import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoApp } from './components/TodoApp/TodoApp';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { SortBy } from './Enums/SortBy';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .finally(() => setIsLoading(false));
    }

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const selectedTodos = () => {
    switch (sortBy) {
      case SortBy.Active:
        return todos.filter(todo => !todo.completed);
      case SortBy.Completed:
        return todos.filter(todo => todo.completed);
      case SortBy.All:
      default:
        return todos;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {user && (
        <TodoApp
          isLoading={isLoading}
          todos={selectedTodos()}
          setTodos={setTodos}
          user={user}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
      )}

      <ErrorNotification />
    </div>
  );
};
