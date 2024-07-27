import { FC, useEffect, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (title: string) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const Form: FC<Props> = ({ title, onSubmit, inputRef }) => {
  const [value, setValue] = useState(title);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    onSubmit(value);
  };

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
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </form>
  );
};
