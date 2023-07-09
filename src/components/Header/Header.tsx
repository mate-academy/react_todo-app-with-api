import React from 'react';
import cn from 'classnames';

import { TodoForm } from '../TodoForm/TodoForm';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddTodo: (todoTitle: string) => Promise<void>;
  handleToggleAllTodos: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  setError,
  handleAddTodo,
  handleToggleAllTodos,
}) => {
  const areAllTodosCompleted = todos.every(todo => todo.completed);
  const isToggleAllActive = todos.length > 0;

  return (
    <header className="todoapp__header">
      {isToggleAllActive && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={handleToggleAllTodos}
          aria-label="Toggle All"
        />
      )}

      <TodoForm handleAddTodo={handleAddTodo} setError={setError} />
    </header>
  );
};
