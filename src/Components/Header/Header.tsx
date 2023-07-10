import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  setError: (error: string) => void,
  addTodo: (newTitle: string) => void,
  tempTodo: Todo | null;
  isAllTodosCompleted: boolean,
  handleToggleButton: () => void,
}

export const Header: React.FC<Props> = ({
  setError,
  addTodo,
  tempTodo,
  isAllTodosCompleted,
  handleToggleButton,
}) => {
  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        aria-label="active"
        onClick={handleToggleButton}
      />
      <TodoForm
        setError={setError}
        addTodo={addTodo}
        tempTodo={tempTodo}
      />
    </header>
  );
};
