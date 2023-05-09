import React, { memo, useCallback } from 'react';

interface Props {
  title: string,
  onChange: (title: string) => void,
  onAdd: () => void;
  isLoading: boolean;
}

export const TodoForm: React.FC<Props> = memo(({
  title,
  onChange,
  onAdd,
  isLoading,
}) => {
  const handleSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onAdd();
  }, [title]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
});
