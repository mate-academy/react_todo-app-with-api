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

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        onClick={handleToggleAll}
      />

      <TodoForm handleAddTodo={handleAddTodo} setError={setError} />
    </header>
  );
};
