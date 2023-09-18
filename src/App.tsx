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

export const App: React.FC = () => {
  const { todos, setTodos } = useTodos();

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { setLoadingTodos } = useLoadingTodos();
  const {
    errorMessage,
    setErrorMessage,
    isErrorHidden,
    setIsErrorHidden,
  } = useErrorMessage();

  const [filterParam, setFilterParam] = useState(Filters.All);

  const clearCompletedTodos = () => {
    const completedTodos = countTodos(todos, true);

    completedTodos.forEach(({ id }) => {
      setLoadingTodos(prev => [...prev, { todoId: id, isLoading: true }]);
      deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter((todo) => id !== todo.id));
        })
        .catch((error) => {
          setErrorMessage(JSON.parse(error.message).error);
          setIsErrorHidden(false);

          setTimeout(() => {
            setIsErrorHidden(true);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(prev => prev.filter(todo => todo.todoId !== id));
        });
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(JSON.parse(error.message).error);
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterParam) {
      case Filters.Active:
        return todos.filter(({ completed }) => !completed);

      case Filters.Completed:
        return todos.filter(({ completed }) => completed);

      case Filters.All:
        return todos;

      default:
        return todos;
    }
  }, [filterParam, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          onWaiting={setTempTodo}
        />

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
          />

          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className={'modal-background'
                  + ' has-background-white-ter'}
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {!!todos?.length && (
          <TodoFilter
            todos={todos}
            filterParam={filterParam}
            onFilterChange={(newFilter) => setFilterParam(newFilter)}
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
