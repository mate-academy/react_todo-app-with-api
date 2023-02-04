import {
  FC, memo, useState,
  KeyboardEvent, FormEvent, useRef, useEffect,
} from 'react';

interface Props {
  oldTitle: string;
  cancelEditing: () => void;
  updateTitle: (title: string) => Promise<void>
  deleteTodo: () => Promise<void>
}

enum Keyboard {
  Escape = 'Escape',
}

export const TodoTitleField: FC<Props> = memo((props) => {
  const {
    cancelEditing,
    oldTitle,
    updateTitle,
    deleteTodo,
  } = props;
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCanceling = (event: KeyboardEvent) => {
    if (event.key === Keyboard.Escape) {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (!title.trim()) {
      deleteTodo();

      return;
    }

    if (oldTitle !== title) {
      await updateTitle(title);
    }

    cancelEditing();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await saveChanges();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title-field"
        onBlur={saveChanges}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
        ref={inputRef}
      />
    </form>
  );
});
