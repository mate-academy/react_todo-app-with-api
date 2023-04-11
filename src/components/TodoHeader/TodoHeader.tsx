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
  // console.log('render HEADER');

  return (
    <header className="todoapp__header">
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
