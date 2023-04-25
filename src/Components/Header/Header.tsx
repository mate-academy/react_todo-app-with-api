import classNames from 'classnames';
import React from 'react';

type Props = {
  title: string;
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitForm: (event: React.FormEvent) => void;
  onToggleAllCompleted: () => void;
  count: number;
  toggle: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onChangeTitle,
  onSubmitForm,
  onToggleAllCompleted,
  count,
  toggle,
}) => (
  <header className="todoapp__header">
    {count !== 0 && (
      <button
        type="button"
        aria-label="toggle-allbutton"
        className={classNames('todoapp__toggle-all ', {
          active: toggle,
        })}
        onClick={onToggleAllCompleted}
      />
    )}

    <form onSubmit={onSubmitForm}>
      <input
        type="text"
        value={title}
        onChange={onChangeTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
