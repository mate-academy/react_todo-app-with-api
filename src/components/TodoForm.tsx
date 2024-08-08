import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (title: string) => void;
}

export const TodoForm: FC<Props> = ({ title, onSubmit }) => {
  const [value, setValue] = useState(title);
  const ref = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(value);
  };

  useEffect(() => {
    ref.current?.focus();
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={ref}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={value}
        onChange={({ target }) => setValue(target.value)}
        onBlur={() => onSubmit(value)}
      />
    </form>
  );
};
