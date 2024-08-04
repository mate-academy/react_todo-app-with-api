import { FC, useEffect, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (title: string) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

// TodoForm component
export const TodoForm: FC<Props> = ({ title, onSubmit, inputRef }) => {
  const [value, setValue] = useState(title);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  // Focus input field when component mounts
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current?.focus();
    }
  }, [inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={value}
        onChange={({ target }) => setValue(target.value)}
        onBlur={() => onSubmit(value)} // Handle onBlur event
      />
    </form>
  );
};
