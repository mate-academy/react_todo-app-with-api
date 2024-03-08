/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { TodoError } from './types/enums/TodoError';
import { TodoFilter } from './types/enums/TodosFilter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodosContext } from './utils/context';
import { getTodosFromServer } from './api/todos';

const USER_ID = '41';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TodoError.Default);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [currentFilter, setCurrentFilter] = useState<TodoFilter>(
    TodoFilter.All,
  );

  const [todosIdsWithActiveLoader, setTodosIdsWithActiveLoader] = useState<
  number[]
  >([]);

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);

      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, currentFilter]);

  const handleFilterChange = (filter: TodoFilter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    getTodosFromServer(+USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer as Todo[]);
      })
      .catch(() => {
        setIsErrorVisible(true);
        setErrorMessage(TodoError.UnableToLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodosContext.Provider
        value={{
          todos,
          setTodos,
          isErrorVisible,
          setIsErrorVisible,
          errorMessage,
          setErrorMessage,
          todosIdsWithActiveLoader,
          setTodosIdsWithActiveLoader,
        }}
      >
        <div className="todoapp__content">
          <TodoHeader setTempTodo={setTempTodo} />

          <TodosList todos={filteredTodos} tempTodo={tempTodo} />

          {!!todos.length && (
            <Footer
              currentFilter={currentFilter}
              filterChange={handleFilterChange}
            />
          )}
        </div>
        <ErrorMessage/>
      </TodosContext.Provider>
    </div>
  );
};
