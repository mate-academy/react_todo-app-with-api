import { ChangeEvent, FormEvent } from 'react';

type Props = {
  handleFormSubmit: (event: FormEvent) => void;
  inputValue: string;
  handleOnInput: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const EditForm: React.FC<Props> = ({
  handleFormSubmit,
  inputValue,
  handleOnInput,
}) => (
  <form onSubmit={handleFormSubmit}>
    <input
      type="text"
      className="todo__title-field"
      placeholder="Note: Empty title deletes a Todo"
      defaultValue={inputValue}
      onChange={handleOnInput}
      onBlur={handleFormSubmit}
    />
  </form>
);
