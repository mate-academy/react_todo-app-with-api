import {
  memo,
  useState,
  KeyboardEvent,
  FormEvent,
} from 'react';

interface TodoTitleFieldProps {
  oldTitle: string;
  cancelEditing: () => void;
  updateTitle: (title: string) => Promise<void>;
}

export const TodoTitleField = memo<TodoTitleFieldProps>(({
  oldTitle,
  cancelEditing,
  updateTitle,
}) => {
  const [title, setTitle] = useState(oldTitle);

  const handleCanceling = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const saveChanges = async () => {
    await updateTitle(title);
    cancelEditing();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await saveChanges();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="todo__title-field"
        type="text"
        onBlur={saveChanges}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleCanceling}
      />
    </form>
  );
});
