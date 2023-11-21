/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onAddTodoError: (errorMessage: string) => void;
  onToggle: () => void;
  isOneTodoCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  activeTodosCount,
  isOneTodoCompleted,
  onTodoAdd,
  onAddTodoError,
  onToggle,
  todos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [activeTodosCount]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTodoTitle = todoTitle.trim();

    if (!preparedTodoTitle) {
      onAddTodoError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: isOneTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      )}

      <form
        onSubmit={onFormSubmit}
      >
        <input
          ref={todoTitleField}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
