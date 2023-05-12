interface Props {
  editedTitle: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: (event?: React.FormEvent) => void;
  onFinishEdit: () => void;
  onCancel: (event: React.KeyboardEvent) => void;
}

export const TodoEditForm: React.FC<Props> = ({
  editedTitle,
  onInput,
  onUpdate,
  onFinishEdit,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onUpdate}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={onInput}
        onBlur={onFinishEdit}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onKeyUp={onCancel}
      />
    </form>
  );
};
