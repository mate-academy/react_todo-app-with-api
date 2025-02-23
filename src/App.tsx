/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { Footer } from './components/Footer';
import { UpdatingFunction, DeletingFunction } from './types/Functions';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [changindIds, setChangingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const startRedacting = (itemId: number) => {
    setChangingIds(prev => [...prev, itemId]);
  };

  const endRedacting = (itemId: number) => {
    setChangingIds(prev => prev.filter(id => id !== itemId));
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = newTodoTitle.trim();

    if (title.length === 0) {
      showErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: todoServices.USER_ID,
    };

    setIsLoading(true);
    const tempId = Math.random();

    setTempTodo({
      ...newTodo,
      id: tempId,
    });

    startRedacting(tempId);

    todoServices
      .createTodo(newTodo)
      .then(res => {
        setTempTodo(null);
        setTodos(prev => [...prev, res]);
        setNewTodoTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        endRedacting(tempId);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  useEffect(() => {
    todoServices
      .getTodos()
      .then(res => {
        setTodos(res);
      })
      .catch(() => showErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, todos.length]);

  const filteredTodos = useMemo(() => {
    return todoServices.filtering(todos, filter);
  }, [todos, filter]);

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo: DeletingFunction = itemId => {
    startRedacting(itemId);

    return todoServices
      .deleteTodo(itemId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== itemId));
      })
      .catch(err => {
        showErrorMessage('Unable to delete a todo');
        throw err;
      })
      .finally(() => endRedacting(itemId));
  };

  const updateTodo: UpdatingFunction = (itemId, updatedTitle = '') => {
    startRedacting(itemId);
    const unmodifiedTodo = todos.find(todo => todo.id === itemId) as Todo;

    const updatedTodo = {
      ...unmodifiedTodo,
      title: updatedTitle ? updatedTitle.trim() : unmodifiedTodo.title,
      completed: !updatedTitle
        ? !unmodifiedTodo.completed
        : unmodifiedTodo.completed,
    };

    setTodos(prev =>
      prev.map(todo => (todo.id === itemId ? updatedTodo : todo)),
    );

    return todoServices
      .updateTodo(itemId, updatedTodo)
      .then(res =>
        setTodos(prev => prev.map(todo => (todo.id === itemId ? res : todo))),
      )
      .catch(err => {
        setTodos(prev =>
          prev.map(todo => (todo.id === itemId ? unmodifiedTodo : todo)),
        );
        showErrorMessage('Unable to update a todo');
        throw err;
      })
      .finally(() => endRedacting(itemId));
  };

  const clearComleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(id => deleteTodo(id));
  };

  const handleToggleAll = () => {
    todos.forEach(todo => {
      if (allCompleted || !todo.completed) {
        updateTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              ref={inputRef}
              onChange={handleChange}
              disabled={isLoading}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            changindIds={changindIds}
            onDeleteItem={deleteTodo}
            tempTodo={tempTodo}
            onUpdate={updateTodo}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            onClick={setFilter}
            onClearCompleted={clearComleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage.length },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
