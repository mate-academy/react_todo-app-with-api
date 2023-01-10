/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

import { NewTodoForm } from '../NewTodoForm/NewTodoFrom';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  activeTodos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>;
  onToggle: () => void;
}

export const Header: React.FC<Props> = (props) => {
  const {
    todos,
    activeTodos,
    title,
    setTitle,
    onSubmit,
    onToggle,
  } = props;

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
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
      )}

      <NewTodoForm
        title={title}
        setTitle={setTitle}
        onSubmit={onSubmit}
      />
    </header>
  );
};
