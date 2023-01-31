import React, {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  oldTitle: string,
  cancelEditing: () => void,
  updateTitle: (title: string) => Promise<void>,
  deleteTodoById: () => Promise<void>,
}

enum Keyboard {
  Escape = 'Escape',
}

export const TodoTitleField: FC<Props> = memo(({
  oldTitle,
  cancelEditing,
  updateTitle,
  deleteTodoById,
}) => {
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCanceling = (event: React.KeyboardEvent) => {
    if (event.key === Keyboard.Escape) {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (oldTitle !== title) {
      await updateTitle(title);
    }

    if (!title.trim()) {
      deleteTodoById();
    }

    cancelEditing();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    saveChanges();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title-field"
        style={{ width: '100%' }}
        value={title}
        onBlur={saveChanges}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
        ref={inputRef}
      />
    </form>
  );
});
