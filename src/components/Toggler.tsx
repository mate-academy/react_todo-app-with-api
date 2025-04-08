import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  shownTodos: Todo[];
  toggleAll: () => Promise<PromiseSettledResult<void>[]>;
};

export const Toggler: React.FC<Props> = ({ shownTodos, toggleAll }) => {
  return (
    <button
      type="button"
      className={`todoapp__toggle-all ${shownTodos.every(todo => todo.completed) && 'active'}`}
      data-cy="ToggleAllButton"
      title="ToggleAllButton"
      onClick={toggleAll}
    />
  );
};
