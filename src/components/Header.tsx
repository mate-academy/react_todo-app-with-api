import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onAdd: (title: string) => void;
  newTodoTitle: string;
  onChangeTitle: (title: string) => void;
  isDisabled: boolean,
  onToggleTodoStatus: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onAdd,
  newTodoTitle,
  onChangeTitle,
  isDisabled,
  onToggleTodoStatus,
}) => {
  const isActive = todos.filter((todo) => !todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAdd(newTodoTitle);
    onChangeTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isActive })}
        aria-label="saveButton"
        onClick={onToggleTodoStatus}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={newTodoTitle}
          onChange={(event) => onChangeTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
