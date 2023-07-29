/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { FormEvent } from 'react';

type Props = {
  title: string,
  setTitle: (value: string) => void;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
  activeTodosQuantity: number;
  onUncompletedCheckedChange: () => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onAdd,
  activeTodosQuantity,
  onUncompletedCheckedChange,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      {!!activeTodosQuantity}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: true,
        })}
        onClick={onUncompletedCheckedChange}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={onAdd}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
