import { FormEvent, KeyboardEvent, useState } from 'react';

interface TodoRenameFormProps {
  currentTitle: string;
  onRenameTodo: (newTitle: string) => Promise<void>;
  onCancel: () => void;
}

export const TodoRenameForm = ({
  currentTitle,
  onRenameTodo,
  onCancel,
}: TodoRenameFormProps) => {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalizedTitle = newTitle.trim();

    try {
      await onRenameTodo(normalizedTitle);
    } catch (error) {}
  };

  const handleButtonPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        autoFocus
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value.trimStart())}
        onBlur={() => handleSubmit()}
        onKeyUp={handleButtonPress}
      />
    </form>
  );
};
