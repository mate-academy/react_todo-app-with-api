import React from 'react';

type Props = {
  title: string;
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitForm: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  isAllCompleted: boolean;
  onToggleAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  isInputDisabled,
  isAllCompleted,
  onChangeTitle,
  onSubmitForm,
  onToggleAllCompleted,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      aria-label="toggle-allbutton"
      className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
      onClick={onToggleAllCompleted}
    />

    <form onSubmit={onSubmitForm}>
      <input
        type="text"
        value={title}
        disabled={isInputDisabled}
        onChange={onChangeTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
