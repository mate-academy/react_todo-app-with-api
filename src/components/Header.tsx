/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { USER_ID } from '../variables/UserID';
import { createTodo, updateTodo } from '../api/todos';
import { Error } from '../types/Errors';

export const Header: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    title,
    todos,
    setTodos,
    setChangedTodos,
    setTempTodo,
    setTitle,
    setErrorMessage,
    errorMessage,
  } = useContext(TodoContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, errorMessage]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const completedTodos = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const toggledTodos = useMemo(() => {
    if (completedTodos) {
      return todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    }

    return todos.map(todo => ({
      ...todo,
      completed: true,
    }));
  }, [todos, completedTodos]);

  const toggleChanges = () => {
    let unCompletedTodos;

    if (!completedTodos) {
      unCompletedTodos = todos.filter(todo => !todo.completed);
    } else {
      unCompletedTodos = todos;
    }

    setChangedTodos(unCompletedTodos);

    unCompletedTodos.forEach(changedTodo => updateTodo({
      ...changedTodo,
      completed: !changedTodo.completed,
    })
      .then(() => {
        setTodos(toggledTodos);
      })
      .catch(() => setErrorMessage(Error.UPDATE_ERROR))
      .finally(() => setChangedTodos([])));
  };

  const addTodo = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(todoFromServer => {
        setTodos(currentTodo => [...currentTodo, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(Error.ADD_ERROR);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabled(true);
      addTodo();
    } else {
      setErrorMessage(Error.TITLE_ERROR);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={toggleChanges}
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: completedTodos })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInput}
          value={title}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
