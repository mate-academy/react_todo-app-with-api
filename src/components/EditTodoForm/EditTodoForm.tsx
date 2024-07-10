import { useEditTodoForm, UseEditTodoFormProps } from './useEditTodoForm';

interface Props extends UseEditTodoFormProps {
  onDelete: VoidFunction;
}

export const EditTodoForm: React.FC<Props> = ({ id, title, onDelete }) => {
  const {
    inputRef,
    titleValue,
    editMode,
    onEnableEditMode,
    onEditTitle,
    onSubmit,
  } = useEditTodoForm({ id, title });

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    onSubmit();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit();
  };

  if (!editMode) {
    return (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onEnableEditMode}
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={titleValue}
        onChange={onEditTitle}
        onBlur={handleBlur}
      />
    </form>
  );
};
