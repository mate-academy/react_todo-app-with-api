import { useEffect, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (title: string) => void;
  inputChangeField: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = ({
  title,
  onSubmit,
  inputChangeField,
}) => {
  const [value, setValue] = useState(title);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(value);
  };

  useEffect(() => {
    inputChangeField.current?.focus();
  }, [inputChangeField]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={value}
        onChange={event => setValue(event.target.value)}
        ref={inputChangeField}
        onBlur={() => onSubmit(value)}
      />
    </form>
  );
};
