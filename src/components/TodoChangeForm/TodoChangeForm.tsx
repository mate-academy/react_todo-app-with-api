import React from 'react';

type Props = {
  onSubmit: (event: React.FormEvent) => void;
  query: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabledInput: boolean;
};

export const TodoChangeForm: React.FC<Props> = ({
  onSubmit,
  query,
  onInputChange,
  disabledInput,
}) => {
  return (
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
  );
};
