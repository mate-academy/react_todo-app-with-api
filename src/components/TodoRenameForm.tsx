import { FormEvent, KeyboardEvent, useState } from 'react';

interface TodoRenameFormProps {
  currentTitle: string;
  onRenameTodo: (newTitle: string) => void;
  onCancel: () => void;
}

export const TodoRenameForm = ({
  currentTitle,
  onRenameTodo,
  onCancel,
}: TodoRenameFormProps) => {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalaizedTitle = newTitle.trim();

    onRenameTodo(normalaizedTitle);
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
