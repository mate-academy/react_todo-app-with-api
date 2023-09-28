/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { useTodo } from '../hooks/useTodo';

type Props = {
  activeTodos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({ activeTodos, setTempTodo }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const {
    todos,
    setErrorMessage,
    addTodoHandler,
    updateTodoHandler,
  } = useTodo();

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target.value);

    if (titleError) {
      setTitleError(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmiting(true);
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');
      setIsSubmiting(false);

      return;
    }

    const newTodo = {
      title: newTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      await addTodoHandler(newTodo);

      setIsSubmiting(false);

      setTitle('');
      setTempTodo(null);
    } catch (error) {
      setIsSubmiting(false);
      setTempTodo(null);
    }
  };

  const onToggleAll = async () => {
    if (activeTodos.length) {
      Promise.all(activeTodos
        .map(currentTodo => updateTodoHandler(
          currentTodo,
          { completed: true },
        )));
    } else {
      Promise.all(todos
        .map(currentTodo => updateTodoHandler(
          currentTodo,
          { completed: false },
        )));
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length
        && (
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !activeTodos.length },
            )}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}
      <form onSubmit={handleSubmit}>
        <input
          ref={todoTitleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
