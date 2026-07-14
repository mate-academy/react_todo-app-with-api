import { FormEventHandler, useState } from 'react';

export type RenameTodoFormProps = {
  defaultValue: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
  onDelete: () => void;
};

export function RenameTodoForm({
  defaultValue,
  onSubmit,
  onClose,
  onDelete,
}: RenameTodoFormProps) {
  const [newTitle, setNewTitle] = useState(defaultValue);

  const handleProcessNewTitle = () => {
    const prepearedTitle = newTitle.trim();

    if (prepearedTitle === defaultValue) {
      onClose();

      return;
    }

    if (prepearedTitle === '') {
      onDelete();

      return;
    }

    onSubmit(prepearedTitle);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    handleProcessNewTitle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value)}
        autoFocus
        onBlur={handleProcessNewTitle}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}
