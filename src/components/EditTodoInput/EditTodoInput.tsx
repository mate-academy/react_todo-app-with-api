import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  editedTitle: string;
  setEditedTitle: (arg: string) => void;
  handleEditing: (id: number, data: string, oldData: string) => void;
  handleCancel: () => void;
};

export const EditTodoInput: React.FC<Props> = (
  {
    todo,
    editedTitle,
    setEditedTitle,
    handleEditing,
    handleCancel,
  },
) => {
  const editTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={editTodoField}`
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, []);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        ref={editTodoField}
        onChange={e => setEditedTitle(e.target.value)}
        onBlur={() => handleEditing(todo.id, editedTitle, todo.title)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleEditing(todo.id, editedTitle, todo.title);
          }

          if (e.key === 'Escape') {
            handleCancel();
          }
        }}
      />
    </form>
  );
};
