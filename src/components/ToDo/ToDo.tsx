import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDelete: (todoId: number) => void,
  handleToggle: (todo: Todo) => void,
  updating: number,
  handleChangingTitle: (todo: Todo, title: string) => void,
  isRenaming: number,
  setIsRenaming: (id: number) => void,
};

export const ToDo: React.FC<Props> = ({
  todo,
  handleDelete,
  handleToggle,
  updating,
  handleChangingTitle,
  isRenaming,
  setIsRenaming,
}) => {
  const [startTitle, setStartTitle] = useState(todo.title);
  const [newTitle, setNewTitle] = useState(startTitle);

  const handleRenamingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>

      {isRenaming === todo.id
        ? (
          <form onSubmit={(event) => {
            event.preventDefault();
            handleChangingTitle(todo, newTitle);
            setIsRenaming(0);
          }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleRenamingTitle}
              onBlur={() => {
                handleChangingTitle(todo, newTitle);
              }}
            />
          </form>
        )
        : (
          <>
            <button
              type="button"
              className="todo__title"
              onClick={(event) => {
                if (event.detail === 2) {
                  setIsRenaming(todo.id);
                  setStartTitle(todo.title);
                }
              }}
            >
              {todo.title}
            </button>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={`modal overlay ${updating === todo.id && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
