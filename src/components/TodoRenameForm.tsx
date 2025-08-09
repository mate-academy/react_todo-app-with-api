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
  const [newTodoTitle, setNewTodoTitle] = useState(currentTitle);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const normalizedNewTitle = newTodoTitle.trim();

    onRenameTodo(normalizedNewTitle);
  };

  const handleButtonPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={input => input && input.focus()}
        autoFocus
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field todoapp__new-todo"
        placeholder="Empty todo will be deleted"
        value={newTodoTitle}
        onChange={event => setNewTodoTitle(event.target.value.trimStart())}
        onBlur={() => handleSubmit()}
        onKeyUp={handleButtonPress}
      />
    </form>
  );
};
