import React from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTdoForm';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  userId: number;
  onAddTodo: (title: string, userId: number) => void;
  onAddErrorMessage: (message: ErrorType) => void;
  isLoading: boolean;
  isAllCompleted: boolean;
  onToggleAllTodos: () => void;
}

export const Header: React.FC<Props> = ({
  userId,
  onAddTodo,
  onAddErrorMessage,
  isLoading,
  isAllCompleted,
  onToggleAllTodos,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={cn('todoapp__toggle-all', { active: isAllCompleted })}
      aria-label="active todos"
      onClick={onToggleAllTodos}
    />

    <AddTodoForm
      userId={userId}
      onAddTodo={onAddTodo}
      onAddErrorMessage={onAddErrorMessage}
      isLoading={isLoading}
    />
  </header>
);
