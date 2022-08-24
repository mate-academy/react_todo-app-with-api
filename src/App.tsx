/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  addTodo,
  getTodos,
  updateTodoByTodoId,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { FilterType } from './types/FilterType';

import './styles/index.scss';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [userId, setUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.All);
  const [todosUpdateStatus, setTodosUpdateStatus] = useState<boolean[]>([]);

  const handleError = useCallback(
    (er: string) => {
      setErrorMessage(er);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setErrorMessage('');

      getTodos(user.id)
        .then(setTodos)
        .catch(handleError)
        .finally(() => {
          setIsUpdateNeeded(false);
          setTodosUpdateStatus(prev => [...prev].fill(false));
        });
    }
  }, [user, isUpdateNeeded]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle) {
      handleError('Title can\'t be empty');

      return;
    }

    addTodo({
      title: newTodoTitle,
      userId,
      completed: false,
    }).then(() => setIsUpdateNeeded(true))
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => setNewTodoTitle(''));
  };

  const handleToggleAll = () => {
    const todosForToggle: Todo[] = [];
    const updateStatuses: boolean[] = [];

    if (todos.some(todo => !todo.completed)) {
      todos.forEach(todo => {
        if (!todo.completed) {
          todosForToggle.push(todo);
          updateStatuses.push(true);
        } else {
          updateStatuses.push(false);
        }
      });
    } else {
      todos.forEach(todo => {
        todosForToggle.push(todo);
        updateStatuses.push(true);
      });
    }

    setTodosUpdateStatus(updateStatuses);

    const requests = Promise.all(
      todosForToggle.map(todo => (
        updateTodoByTodoId(todo.id, { completed: !todo.completed })
      )),
    );

    requests
      .then(() => setIsUpdateNeeded(true))
      .catch(() => handleError('Unable to delete completed todos'));
  };

  const isAllCompleted = useMemo(() => (
    todos.every(el => el.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: isAllCompleted },
            )}
            onClick={handleToggleAll}
          />
        )}

        <form onSubmit={(event) => handleAddTodo(event)}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
          />
        </form>
      </header>

      {todos.length > 0 && (
        <div className="todoapp__content">
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleError={handleError}
                handleUpdate={setIsUpdateNeeded}
                updateStatus={todosUpdateStatus[index]}
              />
            ))}
          </section>

          <TodoFooter
            todos={todos}
            handleError={handleError}
            handleUpdate={setIsUpdateNeeded}
            filterType={filterType}
            handleFilterTypeChange={setFilterType}
          />
        </div>
      )}

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
