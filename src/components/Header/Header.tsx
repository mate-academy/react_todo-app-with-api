/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  onToggleAll: () => void;
  onSubmit: (event: React.FormEvent) => void;
  query: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabledInput: boolean;
};

export const Header: React.FC<Props> = ({
  onToggleAll,
  onSubmit,
  query,
  onInputChange,
  disabledInput,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className="todoapp__toggle-all active"
      onClick={onToggleAll}
    />

    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={onInputChange}
        disabled={disabledInput}
      />
    </form>
  </header>
);
