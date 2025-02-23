import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';

import classNames from 'classnames';
import { Form } from '../Form';

type Props = {
  todos: Todo[];
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  value: string;
  completedTodosCount: number;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  onChange,
  inputRef,
  isLoading,
  value,
  completedTodosCount,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodosCount === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <Form
        addTodo={addTodo}
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        isLoading={isLoading}
        classNames="todoapp__new-todo"
      />
    </header>
  );
};
