type RenamingFormProps = {
  newTitle: string;
  onChange: (newTitle: string) => void;
  onSave: () => void;
  onCancel: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const RenamingForm = ({
  newTitle,
  onChange,
  onSave,
  onCancel,
}: RenamingFormProps) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave();
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={e => onChange(e.target.value)}
        autoFocus
        onBlur={onSave}
        onKeyUp={onCancel}
      />
    </form>
  );
};
