import { FormEventHandler, useState } from 'react';

type RenameTodoFormProps = {
  defaultValue: string;
  onSubmit: (newTitle: string) => void;
  setRenamingId: React.Dispatch<React.SetStateAction<number | null>>;
};

export function RenameTodoForm({
  defaultValue,
  onSubmit,
  setRenamingId,
}: RenameTodoFormProps) {
  const [updatedTitle, setUpdatedTitle] = useState(defaultValue);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit(updatedTitle);
  };

  return (
    <form onSubmit={handleSubmit} onBlur={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updatedTitle}
        onChange={event => setUpdatedTitle(event.target.value)}
        autoFocus
        onKeyDown={event => {
          if (event.key === 'Escape') {
            setRenamingId(null);
          }
        }}
      />
    </form>
  );
}
