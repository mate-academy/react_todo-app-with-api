/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { updateTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { TodoItem } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';

import cn from 'classnames';
import { ErrorsValues } from './utils/errorsValues';
import { FilterStatusValues } from './utils/filterStatusValues';
import { deleteTodo } from './api/todos';

import { Todolist } from './components/Todolist/Todolist';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [tempTodo, setTempTodo] = useState<TodoItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorsValues.UnableToLoadTodos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === FilterStatusValues.Active) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatusValues.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleUpdateTodo = (todoId: number, data: Partial<TodoItem>) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, ...data };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const clearTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() =>
            setTodos(prev => prev.filter(prevTodo => prevTodo.id !== todo.id)),
          )
          .catch(() => setErrorMessage(ErrorsValues.UnableToDeleteTodo)),
      ),
    ).then(() => {
      inputRef.current?.focus();
    });
  };

  const toggleAllTodos = () => {
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: newStatus })
          .then(updatedTodo => {
            setTodos(prev =>
              prev.map(prevTodo =>
                prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
              ),
            );
          })
          .catch(() => setErrorMessage(ErrorsValues.UnableToUpdateTodo)),
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          allCompleted={allCompleted}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          toggleAllTodos={toggleAllTodos}
          inputRef={inputRef}
        />

        {(visibleTodos.length > 0 || tempTodo) && (
          <Todolist
            visibleTodos={visibleTodos}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
            tempTodo={tempTodo}
            inputRef={inputRef}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearTodos}
              disabled={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
