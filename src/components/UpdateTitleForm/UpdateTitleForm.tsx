import { useState } from 'react';

type Props = {
  id: number,
  title: string,
  handleSubmit: (title: string, id: number) => void,
  setIsDoubleClicked: (clicked: boolean) => void,
};

export const UpdateTitleForm: React.FC<Props> = ({
  id, title, handleSubmit, setIsDoubleClicked,
}) => {
  const [newTitle, setNewTitle] = useState(title);

  const onEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
      setNewTitle(title);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(newTitle, id);
      }}
      onBlur={(event) => {
        event.preventDefault();
        handleSubmit(newTitle, id);
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => {
          setNewTitle(event.target.value);
        }}
        onKeyDown={onEsc}
      />
    </form>
  );
};
