/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoChangeForm } from '../TodoChangeForm';

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

    <TodoChangeForm
      onSubmit={onSubmit}
      query={query}
      onInputChange={onInputChange}
      disabledInput={disabledInput}
    />
  </header>
);
