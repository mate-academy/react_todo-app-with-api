import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadAllDelete, setIsLoadAllDelete] = useState(false);
  const [isLoadAllToggle, setIsLoadAllToggle] = useState(false);
  const user = useContext(AuthContext);

  const setTodosList = () => {
    if (!user) {
      return;
    }

    setTodos([{
      id: 0,
      userId: 0,
      title: '',
      completed: false,
    }]);
    getTodos(user.id)
      .then(data => setTodos(data))
      .catch(() => {
        setIsError(Error.Update);
        setTodos([]);
      });
  };

  const getFilteredTodos = () => {
    if (!todos || todos.length === 0) {
      return null;
    }

    const todosList = [...todos];

    return todosList.filter((todo) => {
      switch (filter) {
        case Filter.Active: return !todo.completed;
        case Filter.Completed: return todo.completed;
        case Filter.All:
        default:
          return true;
      }
    });
  };

  const filteredTodos = getFilteredTodos();

  useEffect(() => {
    setTodosList();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setErrorsArgument={setIsError}
          setTodos={setTodos}
          todos={todos}
          setTempTodo={setTempTodo}
          setIsLoadAllToggle={setIsLoadAllToggle}
        />
        {filteredTodos && (
          <TodoList
            isLoadAllDelete={isLoadAllDelete}
            todos={filteredTodos}
            setErrorsArgument={setIsError}
            tempTodo={tempTodo}
            setTodos={setTodos}
            isLoadAllToggle={isLoadAllToggle}
          />
        )}
        {filteredTodos && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            setErrorsArgument={setIsError}
            setTodos={setTodos}
            setIsLoadAllDelete={setIsLoadAllDelete}
          />
        )}
      </div>

      {isError && (
        <ErrorNotification
          error={isError}
          setIsError={setIsError}
        />
      )}
    </div>
  );
};
