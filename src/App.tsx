import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Filters } from './utils/Filters';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import {
  deleteTodo,
  getTodos,
} from './api/todos';
import { countTodos } from './utils/countTodos';
import {
  useTodos,
} from './components/Contexts/TodosContext';
import { USER_ID } from './utils/userToken';
import {
  useLoadingTodos,
} from './components/Contexts/LoadingTodosContext';
import {
  useErrorMessage,
} from './components/Contexts/ErrorMessageContext';
import { TempTodo } from './components/TempTodo/TempTodo';

export const App: React.FC = () => {
  const { todos, setTodos } = useTodos();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { setLoadingTodos } = useLoadingTodos();
  const {
    errorMessage,
    isErrorHidden,
    setIsErrorHidden,
    handleShowError,
  } = useErrorMessage();
  const [filterParam, setFilterParam] = useState(Filters.All);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleShowError('Unable to load todos');
      });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterParam) {
      case Filters.Active:
        return todos.filter(({ completed }) => !completed);

      case Filters.Completed:
        return todos.filter(({ completed }) => completed);

      case Filters.All:
      default:
        return todos;
    }
  }, [filterParam, todos]);

  const clearCompletedTodos = async () => {
    const completedTodos = countTodos(todos, true).map(({ id }) => (
      deleteTodo(id)));

    countTodos(todos, true).forEach(({ id }) => {
      setLoadingTodos(prev => [...prev, id]);
    });

    try {
      await Promise.all(completedTodos);
      setTodos(prev => prev.filter(({ completed }) => !completed));
    } catch {
      handleShowError('Unable to delete todo');
    }

    setLoadingTodos([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo onWaiting={setTempTodo} />

        <section className="todoapp__main">
          <TodoList todos={visibleTodos} />

          {tempTodo && (
            <TempTodo title={tempTodo.title} />
          )}
        </section>

        {!!todos?.length && (
          <TodoFilter
            todos={todos}
            filterParam={filterParam}
            onFilterChange={setFilterParam}
            clearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsErrorHidden(true)}
          aria-label="Delete Button"
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
