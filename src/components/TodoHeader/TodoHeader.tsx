import React from 'react';
import cn from 'classnames';

import { TodoForm } from '../TodoForm';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddTodo: (todoTitle: string) => Promise<void>;
  handleToggleAll: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  setError,
  handleAddTodo,
  handleToggleAll,
}) => {
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const isToggleAllButtonVisible = todos.length > 0;

  return (
    <header className="todoapp__header">
      {isToggleAllButtonVisible && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          aria-label="header-toggle-button"
          onClick={handleToggleAll}
        />
      )}

      <TodoForm handleAddTodo={handleAddTodo} setError={setError} />
    </header>
  );
};
