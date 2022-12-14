import React from 'react';
import classNames from 'classnames';

import { NewTodoForm } from '../NewTodoForm/NewTodoForm';

import { Todo } from '../../types/Todo';

interface Props {
  activeTodos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>;
  onToggle: () => Promise<void>;
}

export const Header: React.FC<Props> = (props) => {
  const {
    activeTodos,
    title,
    setTitle,
    onSubmit,
    onToggle,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: activeTodos.length === 0,
          },
        )}
        onClick={onToggle}
      />

      <NewTodoForm
        title={title}
        setTitle={setTitle}
        onSubmit={onSubmit}
      />
    </header>
  );
};
