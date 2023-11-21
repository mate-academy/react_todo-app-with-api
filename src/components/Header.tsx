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
    handleAddTodo,
    handleUpdateTodo,
  } = useTodo();

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [todos.length]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target.value);

    if (titleError) {
      setTitleError(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      await handleAddTodo(newTodo);

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
      const updatePromises = activeTodos.map(currentTodo => handleUpdateTodo(
        currentTodo,
        { completed: true },
      ));

      await Promise.all(updatePromises);
    } else {
      const updatePromises = todos.map(currentTodo => handleUpdateTodo(
        currentTodo,
        { completed: false },
      ));

      await Promise.all(updatePromises);
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
          >
            {' '}
          </button>
        )}
      <form onSubmit={onSubmit}>
        <input
          ref={todoTitleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onTitleChange}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
