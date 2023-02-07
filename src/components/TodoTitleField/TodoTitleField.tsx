import React, {
  FC, useState, KeyboardEvent, useRef, useEffect,
} from 'react';

type Props = {
  prevTitle: string;
  stopEditing: () => void;
  updateTitle: (title: string) => Promise<void>;
  deleteTodoById: () => Promise<void>;
};

enum Keyboard {
  Escape = 'Escape',
}

export const TodoTitleField: FC<Props> = React.memo((props) => {
  const {
    prevTitle,
    stopEditing,
    updateTitle,
    deleteTodoById,
  } = props;

  const [newTitle, setNewTitle] = useState(prevTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const exitUpdateForm = (event: KeyboardEvent) => {
    if (event.key === Keyboard.Escape) {
      stopEditing();
    }
  };

  const saveUpdatedTitle = async () => {
    if (!newTitle.trim()) {
      deleteTodoById();

      return;
    }

    if (prevTitle !== newTitle) {
      await updateTitle(newTitle);
    }

    stopEditing();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    saveUpdatedTitle();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={saveUpdatedTitle}
        onKeyDown={exitUpdateForm}
        ref={inputRef}
      />
    </form>
  );
});
