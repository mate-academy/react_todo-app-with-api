import React from 'react';
import { Ref } from 'react';
import cn from 'classnames';

type Props = {
  createTodo: () => void;
  handleTitleChange: (title: string) => void;
  handleToggleAll: () => void;
  hasAnyTodos: boolean;
  isNewTodoLoading: boolean;
  isToggleAllActive: boolean;
  newTodoTitle: string;
  todoInput: Ref<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  createTodo,
  handleTitleChange,
  handleToggleAll,
  hasAnyTodos,
  isNewTodoLoading,
  isToggleAllActive,
  newTodoTitle,
  todoInput,
}) => {
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createTodo();
  };

  return (
    <header className="todoapp__header">
      {hasAnyTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isToggleAllActive })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll()}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isNewTodoLoading}
          ref={todoInput}
          value={newTodoTitle}
          onChange={event => handleTitleChange(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
