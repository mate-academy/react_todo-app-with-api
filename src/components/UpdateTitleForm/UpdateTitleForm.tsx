import { useEffect, useRef, useState } from 'react';

type Props = {
  id: number,
  title: string,
  handleSubmit: (title: string, id: number) => void,
  setClickedId: (id: number) => void,
  setIsDoubleClicked: (click: boolean) => void,
};

export const UpdateTitleForm: React.FC<Props> = ({
  id, title, handleSubmit, setClickedId, setIsDoubleClicked,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const onEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setClickedId(0);
      setIsDoubleClicked(false);
      setNewTitle(title);
    }
  };

  const newTitleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitleInput.current) {
      newTitleInput.current.focus();
    }
  }, []);

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
        ref={newTitleInput}
        onChange={(event) => {
          setNewTitle(event.target.value);
        }}
        onKeyDown={onEsc}
      />
    </form>
  );
};
