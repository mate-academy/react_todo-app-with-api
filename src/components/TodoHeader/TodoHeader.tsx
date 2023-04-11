import React from 'react';
import classNames from 'classnames';
import { NewTodo } from '../NewTodo';

type Props = {
  isToggleActive: boolean;
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onTodoToggleAll: (isCompleted: boolean) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  isToggleActive,
  onTodoAdd,
  onTodoToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isToggleActive,
          },
        )}
        onClick={() => onTodoToggleAll(!isToggleActive)}
      />

      <NewTodo onTodoAdd={onTodoAdd} />
    </header>
  );
};
