import React from 'react';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  toggleAllTodos: () => void;
}
export const ToggleAllButton: React.FC<Props> = ({ todos, toggleAllTodos }) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <button
      className="todapp__toggle-all"
      onAuxClick={toggleAllTodos}
      type="button"
      data-cy="ToggleAllButton"
    >
      Toggle All
    </button>
  );
};
