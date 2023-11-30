/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  deleteTodos,
  getTodos,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { Errors } from './types/Errors';

const USER_ID = 11901;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[] | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const todosCounter = todos.length - todos
    .reduce((acc, todo) => acc + +todo.completed, 0);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          return todos;
      }
    });
  }, [filterBy, todos]);

  const inputTitleRef = useRef<HTMLInputElement | null>(null);

  const deleteTodo = (todoId: number) => {
    setLoadingId(todoId);

    deleteTodos(todoId)
      .then(() => {
        setTodos(todos.filter(tds => tds.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Errors.UnableDelete);
      })
      .finally(() => {
        setLoadingId(null);
        if (inputTitleRef.current) {
          inputTitleRef.current.focus();
        }
      });
  };

  const handleClearCompleted = () => {
    const clearCompleted = todos.filter(todo => todo.completed);

    setLoadingIds(clearCompleted.map(item => item.id));

    clearCompleted.forEach(todo => (
      deleteTodos(todo.id)
        .then(() => setTodos(previoustodos => previoustodos
          .filter(item => item.id !== todo.id)))
        .catch(() => {
          setErrorMessage(Errors.UnableDelete);
        })
        .finally(() => {
          setLoadingIds([]);
          if (inputTitleRef.current) {
            inputTitleRef.current.focus();
          }
        })
    ));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.UnableLoad);
      });
  }, [filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (errorMessage) {
    setTimeout(() => setErrorMessage(Errors.Empty), 2000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputTitleRef={inputTitleRef}
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingIds}
        />
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoList
              onDelete={deleteTodo}
              setLoadingId={setLoadingId}
              loadingId={loadingId}
              todos={visibleTodos}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              loadingIds={loadingIds}
              todo={todo}
              key={todo.id}
            />
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: tempTodo.completed })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay is-active')}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            todosCounter={todosCounter}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            setLoadingId={setLoadingIds}
            onCompletedDelete={handleClearCompleted}
          />
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={
          cn(
            'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
            { hidden: !errorMessage },
          )
        }
      >
        {errorMessage && (
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage(Errors.Empty)}
          />
        )}
        {errorMessage}
      </div>
    </div>
  );
};
