import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo?: (todoId: number) => void,
  removingId?: number | null,
  updateTodo: (todo: Todo) => void,
};

export const TodoItem:React.FC<Props> = ({
  todo, removeTodo, removingId, updateTodo,
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [currentTitle, setCurrentTitle] = useState<string>(todo.title);
  const [editedTitle, setEditedTitle] = useState<string>(currentTitle);

  const handleToggleStatus = () => {
    if (!todo || !updateTodo) {
      return;
    }

    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleChangeTitle = () => {
    if (!todo) {
      return;
    }

    if (todo?.title === editedTitle) {
      setEdit(false);

      return;
    }

    if (!editedTitle && removeTodo) {
      removeTodo(todo.id);

      return;
    }

    setCurrentTitle(editedTitle);

    updateTodo({
      ...todo,
      title: editedTitle,
    });

    setEdit(false);
  };

  const submitForm = (event: React.FormEvent) => {
    event?.preventDefault();
    handleChangeTitle();
  };

  const cancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEdit(false);
    }
  };

  return (
    <div
      key={todo?.id}
      className={classNames('todo', {
        completed: todo?.completed,
      })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={handleToggleStatus}
        />
      </label>

      {!edit ? (
        <span
          className="todo__title"
          onDoubleClick={() => setEdit(true)}
        >
          {currentTitle}
        </span>
      ) : (
        <form onSubmit={submitForm}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={handleChangeTitle}
            onKeyUp={cancelEdit}
          />
        </form>
      )}

      {isHover && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => removeTodo?.(todo!.id)}
        >
          ×
        </button>
      )}

      <div className={classNames('modal overlay', {
        'is-active': removingId === todo.id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
