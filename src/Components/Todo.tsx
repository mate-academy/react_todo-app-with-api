import { useState } from 'react';
import { Todo as TodoType } from '../types/Todo';

interface Props {
  todo: TodoType
  temp?: boolean,
  handleRemoveTodo?: (id: number) => void,
  handleComplete?: (id: number, completed: boolean) => void,
  handleEditTitle?: (id: number, text: string) => void,
}

export const Todo: React.FC<Props> = ({
  todo,
  temp,
  handleRemoveTodo,
  handleComplete,
  handleEditTitle,
}) => {
  const { id, title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleRemoveClick = () => {
    if (!temp && handleRemoveTodo) {
      handleRemoveTodo(todo.id);
      setIsDeleting(true);
    }
  };

  const handleCompleteChange = () => {
    if (handleComplete) {
      handleComplete(id, completed);
    }
  };

  const handleEditTodo = () => {
    setIsEditing(true);
  };

  const handleSubmitEdit = () => {
    if (handleEditTitle) {
      handleEditTitle(id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`todo ${completed && 'completed'}`}
      style={{
        opacity: `${temp || isDeleting ? '0.1' : '1'}`,
      }}
    >
      <label className="todo__status-label active">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleCompleteChange}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span className="todo__title" onDoubleClick={handleEditTodo}>
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveClick}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleSubmitEdit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleSubmitEdit}
              onKeyUp={handleKeyUp}
            />
          </form>
        )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
