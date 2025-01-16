import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './Types/Todo';
import { Footer } from './Components/Footer/Footer';
import { Errors } from './Components/ErrorMessage/ErrorMessage';
import { Header } from './Components/Header/Header';
import { TodoFilter } from './Types/TodoFilter';
import TodoList from './Components/TodoList/TodoList';
import { TodoInfo } from './Components/Todo/TodoInfo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [toggleTodos, setToggleTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setToggleTodos={setToggleTodos}
          setTempTodo={setTempTodo}
          setError={setError}
        />

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            toggleTodos={toggleTodos}
            setTodos={setTodos}
            setError={setError}
            key={tempTodo.id}
          />
        )}

        {/* Pass filteredTodos to TodoList */}
        {filteredTodos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            toggleTodos={toggleTodos}
            setTodos={setTodos}
            setError={setError}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
          />
        )}
      </div>

      <Errors error={error} setError={setError} />
    </div>
  );
};
