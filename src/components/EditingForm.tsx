import { useEffect, useRef, useState } from 'react';
import { UpdateTodo } from '../types/UpdateTodo';

interface Props {
  handleUpdatingTodo: (todoId: number, args: UpdateTodo) => void;
  editedTodoId: number;
  currentTodoTitle: string;
  setEditedTodoId: (editedTodoId: number) => void;
  handleDeletingTodo: (todoId: number) => void;
}

export const EditingForm: React.FC<Props> = (
  {
    handleUpdatingTodo,
    editedTodoId,
    currentTodoTitle,
    setEditedTodoId,
    handleDeletingTodo,
  },
) => {
  const [editedTodoTitle, setEditedTodoTitle]
  = useState<string>(currentTodoTitle);

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current && editedTodoId) {
      inputField.current.focus();
    }
  }, [editedTodoId]);

  const handleSubmit = () => {
    if (editedTodoTitle !== currentTodoTitle && editedTodoTitle !== '') {
      handleUpdatingTodo(editedTodoId, { title: editedTodoTitle });
    } else if (editedTodoTitle === '') {
      handleDeletingTodo(editedTodoId);
    }

    setEditedTodoId(0);
  };

  const handleEscape = (event: { key: string; }) => {
    if (event.key === 'Escape') {
      setEditedTodoId(0);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTodoTitle}
        ref={inputField}
        onChange={event => setEditedTodoTitle(event.target.value)}
        onKeyUp={handleEscape}
        onBlur={handleSubmit}
      />
    </form>
  );
};
