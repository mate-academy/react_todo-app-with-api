import {
  FC, FormEvent,
  KeyboardEvent,
  memo, useEffect, useRef,
  useState,
} from 'react';

import './TodoTitleField.scss';

enum Keyboard {
  Escape = 'Escape',
}

interface Props {
  cancelEditing: () => void,
  oldTitle: string,
  updateTitle: (title: string) => Promise<void>,
  deleteTodoById: () => Promise<void>,
  onDeleteTodo: () => void,
}

export const TodoTitleField: FC<Props> = memo((props) => {
  const {
    cancelEditing,
    oldTitle,
    updateTitle,
    onDeleteTodo,
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
      onDeleteTodo();

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
