import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  setError: (error: string) => void;
  onAdd: (title: string) => void;
  tempTodo: Todo | null;
  toggleAllCompletedTodos: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  areAllCompleted: boolean;
}

export const Header: React.FC<Props> = ({
  setError,
  onAdd,
  tempTodo,
  toggleAllCompletedTodos,
  areAllCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: areAllCompleted,
      })}
      onClick={toggleAllCompletedTodos}
      aria-label="Toggle All Completed"
    />

    <TodoForm setError={setError} onAdd={onAdd} tempTodo={tempTodo} />
  </header>
);
