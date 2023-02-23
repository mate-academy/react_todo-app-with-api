import React from 'react';
import cn from 'classnames';

interface Props {
  hasActiveTodos: boolean,
  todoTitle: string,
  todoTitleChange: (value: string) => void,
  handleAddTodo: (todoTitle: string) => void,
  disableInput: boolean,
  toggleAll: () => void,
}

export const Header: React.FC<Props> = ({
  hasActiveTodos,
  todoTitle,
  todoTitleChange,
  handleAddTodo,
  disableInput,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !hasActiveTodos,
        })}
        onClick={toggleAll}
      />

      <form onSubmit={event => {
        event.preventDefault();
        handleAddTodo(todoTitle);
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => todoTitleChange(event.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
