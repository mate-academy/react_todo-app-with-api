/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  data: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  todoInOperation: number[];
  isEdited: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllTodos: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  data,
  newTodoTitle,
  setNewTodoTitle,
  handleKeyDown,
  todoInOperation,
  inputRef,
  toggleAllTodos,
}) => {
  return (
    <header className="todoapp__header">
      {data.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: data.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all todos"
          onClick={toggleAllTodos}
          disabled={data.length === 0}
        />
      )}

      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={todoInOperation.length > 0}
      />
    </header>
  );
};
