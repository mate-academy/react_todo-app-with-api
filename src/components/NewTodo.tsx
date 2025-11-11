import React, { useEffect, useState } from 'react';

type Props = {
  onSetError: (arg: string) => void;
  onAddTodo: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  onSetError,
  onAddTodo,
  inputRef,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, inputRef]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetError('Title should not be empty');

      return;
    }

    setIsDisabled(true);
    try {
      await onAddTodo(title.trim());
      setTitle('');
    } catch {
    } finally {
      setIsDisabled(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setTitle(event.target.value.trimStart());

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        disabled={isDisabled}
        onChange={handleChange}
      />
    </form>
  );
};
