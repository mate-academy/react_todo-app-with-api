/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoItem } from './components/TodoItem';
import { Status } from './types/Status';
import { Filter } from './components/TodoFilter';
import { addTodos, getTodos } from './api/todos';

const USER_ID = 11498;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState(Status.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [wasThereAdding, setWasThereAdding] = useState(false);
  const [areAllCompletedDeleting, setAreAllCompletedDeleting] = useState(false);
  const [areAllToggling, setAreAllToggling] = useState(false);

  const completedTodos: Todo[] = [];
  const activeTodos: Todo[] = [];
  let visibleTodos: Todo[] = [];

  todos.forEach(todo => (todo.completed ? completedTodos.push({ ...todo }) : activeTodos.push({ ...todo })));

  switch (activeFilter) {
    case Status.Active:
      visibleTodos = activeTodos;
      break;

    case Status.Completed:
      visibleTodos = completedTodos;
      break;

    case Status.All:
    default:
      visibleTodos = todos;
  }

  const completedExist = !!completedTodos.length;
  const areAllCompleted = completedTodos.length === todos.length && !!todos.length;

  const inputRef = useRef<HTMLInputElement>(null);

  const errorTimeoutID = useRef(0);

  const handleError = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
    errorTimeoutID.current = window.setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  useEffect(() => {
    if (hasError) {
      setHasError(false);
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));

    return () => window.clearTimeout(errorTimeoutID.current);
  }, [activeFilter]);

  useEffect(() => {
    if (wasThereAdding) {
      inputRef.current?.focus();
    }
  }, [wasThereAdding]);

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    window.clearTimeout(errorTimeoutID.current);

    if (!inputValue.trim()) {
      handleError("Title can't be empty");

      return;
    }

    const data = {
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...data });
    setWasThereAdding(false);
    setIsLoading(true);

    addTodos(data)
      .then(response => {
        setTodos([...todos, response]);
        setInputValue('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setWasThereAdding(true);
        setIsLoading(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    return client.delete(`/todos/${todoId}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => handleError('Unable to delete a todo'));
  };

  const deleteAllCompleted = () => {
    setAreAllCompletedDeleting(true);

    Promise.all(completedTodos.map(todo => client.delete(`/todos/${todo.id}`)))
      .then(() => setTodos(activeTodos))
      .catch(() => handleError('Unable to delete todos'))
      .finally(() => setAreAllCompletedDeleting(false));
  };

  const updateTodo = (todoId: number, data: Todo) => {
    return client.patch<Todo>(`/todos/${todoId}`, data)
      .then(receivedTodo => {
        setTodos(todos.map(todo => {
          return todo.id === todoId ? receivedTodo : todo;
        }));
      })
      .catch(() => handleError('Unable to update a todo'));
  };

  const toggleAll = () => {
    const promiseArray = (areAllCompleted ? completedTodos : activeTodos)
      .map(todo => client.patch(`/todos/${todo.id}`, { completed: !todo.completed }));

    setAreAllToggling(true);

    Promise.all(promiseArray)
      .then(() => {
        setTodos(todos.map(todo => (
          { ...todo, completed: !areAllCompleted }
        )));
      })
      .catch(() => handleError('Unable to toggle todos'))
      .finally(() => setAreAllToggling(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: areAllCompleted,
            })}
            onClick={toggleAll}
          />

          <form
            onSubmit={addTodo}
          >
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              onBlur={() => setWasThereAdding(false)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              areAllCompletedDeleting={areAllCompletedDeleting}
              areAllToggling={areAllToggling}
              areAllCompleted={areAllCompleted}
            />
          ))}

          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <Filter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <button
              type="button"
              className={classNames('todoapp__clear-completed', {
                'todoapp__clear-completed--hidden': !completedExist,
              })}
              onClick={deleteAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !hasError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setHasError(false)}
        />

        {errorMessage}
      </div>
    </div>
  );
};
