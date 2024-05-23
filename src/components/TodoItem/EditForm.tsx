import { useEffect, useRef } from 'react';

type EditFormProps = {
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOnEscape: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleOnBlur: () => void;
  editedTitle: string;
  setEditedTitle: (editedTitle: string) => void;
  editing: boolean;
};

export const EditForm: React.FunctionComponent<EditFormProps> = ({
  handleEditSubmit,
  handleOnBlur,
  handleOnEscape,
  editedTitle,
  setEditedTitle,
  editing,
}) => {
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  }, [editing]);

  return (
    <form onSubmit={handleEditSubmit}>
      <input
        ref={inputFocusRef}
        onKeyDown={handleOnEscape}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={e => {
          setEditedTitle(e.target.value);
        }}
        onBlur={handleOnBlur}
      />
    </form>
  );
};
