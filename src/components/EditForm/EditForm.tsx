import { ChangeEvent, FormEvent, KeyboardEvent } from 'react';

type Props = {
  handleSubmit: (event: FormEvent) => void,
  editedTitle: string,
  handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void,
  exitEdit: (event: KeyboardEvent<HTMLInputElement>) => void,
  inputRef: React.RefObject<HTMLInputElement>,
};

export const EditForm: React.FC<Props> = ({
  handleSubmit,
  editedTitle,
  handleTitleChange,
  exitEdit,
  inputRef,
}) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      className="todo__title-field"
      placeholder="Note: Empty title deletes a Todo"
      value={editedTitle}
      onChange={handleTitleChange}
      onKeyUp={exitEdit}
      ref={inputRef}
      onBlur={handleSubmit}
    />
  </form>
);
