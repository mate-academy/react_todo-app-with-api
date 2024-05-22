import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionNames, TodoContext, errors } from './TodoContext';
import { Todo } from '../types/Todo';
import { USER_ID, createTodo, updateTodo } from '../api/todos';
import cn from 'classnames';

export const TEMP_USER_ID = 0;

export const Header: React.FC = () => {
  const {
    todos,
    dispatch,
    handleError,
    tmpTodo,
    handleTmpTodo,
    originalTodos,
    handleLoading,
  } = useContext(TodoContext);
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      handleError(errors.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: TEMP_USER_ID,
      userId: USER_ID,
      completed: false,
      title: value.trim(),
    };

    setDisabled(true);

    handleTmpTodo(newTodo);

    createTodo(newTodo)
      .then(nt => {
        handleTmpTodo(null);
        dispatch({ type: ActionNames.Add, payload: nt });
        setValue('');
      })
      .catch(() => {
        handleError(errors.AddTodo);
        handleTmpTodo(null);
      })
      .finally(() => setDisabled(false));
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [todos, tmpTodo]);

  const completed =
    todos.length && todos.some(todo => todo.completed === false);
  const allCompleted = originalTodos.every(todo => todo.completed);

  const handleCompletedAll = () => {
    const completedTodos = todos.some(todo => !todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);
    const shouldUpdateTodos = allCompleted ? todos : activeTodos;

    handleLoading(activeTodos.map(({ id }) => id));

    const promises: Promise<Todo>[] = [];

    shouldUpdateTodos.forEach(todo => {
      promises.push(
        updateTodo({
          ...todo,
          completed: completedTodos,
        }),
      );
    });

    Promise.all(promises)
      .then(() => {
        dispatch({ type: ActionNames.ToggleAllCompleted });
      })
      .catch(() => {
        handleError(errors.UpdateTodo);
      })
      .finally(() => {
        handleLoading([]);
      });
  };

  useEffect(() => {
    if (allCompleted) {
      focusInput();
    }
  }, [allCompleted]);

  return (
    <header className="todoapp__header">
      {!!originalTodos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !completed,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompletedAll}
        />
      )}

      <form onSubmit={handleKeyDown}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={value}
          ref={inputRef}
          disabled={disabled}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
