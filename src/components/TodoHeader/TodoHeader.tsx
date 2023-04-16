import React from 'react';
import classNames from 'classnames';
import { NewTodo } from '../NewTodo';

type Props = {
  isToggleVisible: boolean;
  isToggleActive: boolean;
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onTodoToggleAll: (isCompleted: boolean) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = React.memo(({
  isToggleVisible,
  isToggleActive,
  onTodoAdd,
  onTodoToggleAll,
}) => (
  <header className="todoapp__header">
    {isToggleVisible && (
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isToggleActive,
          },
        )}
        onClick={() => onTodoToggleAll(!isToggleActive)}
        aria-label="Toggle"
      />
    )}

    <NewTodo onTodoAdd={onTodoAdd} />
  </header>
));
