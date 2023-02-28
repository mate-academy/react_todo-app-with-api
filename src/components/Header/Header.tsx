import React from 'react';
import cn from 'classnames';

interface Props {
  hasActiveTodos: boolean,
  todoTitle: string,
  todoTitleChange: (value: string) => void,
  handleAddTodo: (todoTitle: string) => void,
  disableInput: boolean,
  toggleAll: () => void,
  itemsCounter: number,
}

export const Header: React.FC<Props> = ({
  hasActiveTodos,
  todoTitle,
  todoTitleChange,
  handleAddTodo,
  disableInput,
  toggleAll,
  itemsCounter,
}) => (
  <header className="todoapp__header">
    {itemsCounter > 0 && (
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all', {
            active: !hasActiveTodos,
          },
        )}
        onClick={toggleAll}
        aria-label=" "
      />
    )}

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
