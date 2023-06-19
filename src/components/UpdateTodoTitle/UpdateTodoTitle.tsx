import React, {
  FormEvent,
  KeyboardEvent,
  memo,
  useState,
  useRef,
  useEffect,
} from 'react';

interface UpdateTodoTitleProps {
  oldTitle: string,
  cancelEditing: () => void,
  updateTitle: (title: string) => Promise<void>
  deleteTodo: () => Promise<void>
}

export const UpdateTodoTitle: React.FC<UpdateTodoTitleProps> = memo(({
  oldTitle,
  cancelEditing,
  updateTitle,
  deleteTodo,
}) => {
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCanceling = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (oldTitle !== title) {
      await updateTitle(title);
    }

    if (!title || title.trim() === '') {
      deleteTodo();

      return;
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
