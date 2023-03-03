import {
  memo,
  useState,
  KeyboardEvent,
  FormEvent,
  useRef,
  useEffect,
} from 'react';

interface TodoTitleFieldProps {
  isUpdatingTodo: boolean;
  oldTitle: string;
  cancelEditing: () => void;
  updateTitle: (title: string) => Promise<void>;
  deleteTodo: () => Promise<void>;
}

export const TodoTitleField = memo<TodoTitleFieldProps>(({
  oldTitle,
  cancelEditing,
  updateTitle,
  deleteTodo,
  isUpdatingTodo,
}) => {
  const [title, setTitle] = useState(oldTitle);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCanceling = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    if (!title.trim()) {
      deleteTodo();
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
        disabled={isUpdatingTodo}
        className="todo__title-field"
        type="text"
        onBlur={saveChanges}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
        ref={inputRef}
      />
    </form>
  );
});
