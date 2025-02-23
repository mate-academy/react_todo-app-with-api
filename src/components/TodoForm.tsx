import { useEffect, useState } from 'react';

type Props = {
  title: string;
  onSubmit: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoForm: React.FC<Props> = ({ title, onSubmit, inputRef }) => {
  const [value, setValue] = useState(title);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(value);
  };

  useEffect(() => {
    inputRef.current?.focus();
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
        onChange={e => setValue(e.target.value)}
        onBlur={() => onSubmit(value)}
      />
    </form>
  );
};
