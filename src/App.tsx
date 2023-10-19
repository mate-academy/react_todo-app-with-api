import React, {
  useContext,
  useEffect, useMemo, useState,
} from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as todoService from './api/todos';
import { TodosFilter } from './types/TodosFilter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoContext } from './Context/TodoContext';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
  } = useContext(TodoContext);

  const [filter, setFilter] = useState(TodosFilter.All);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />
        <TodoList
          todos={filteredTodos}
        />
        {Boolean(todos.length) && (
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
          />
        )}

      </div>
      <ErrorNotification />
    </div>
  );
};
