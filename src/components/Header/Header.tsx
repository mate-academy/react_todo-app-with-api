/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  addTodo: (title: string) => void;
  isAllCompleted: boolean;
  isInputDisabled: boolean;
  editStatusOfAllTodos: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  isAllCompleted,
  isInputDisabled,
  editStatusOfAllTodos,
  addTodo,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={cn(
        'todoapp__toggle-all',
        { active: isAllCompleted },
      )}
      onClick={editStatusOfAllTodos}
    />

    <AddTodoForm
      addTodo={addTodo}
      isInputDisabled={isInputDisabled}
    />
  </header>
));
