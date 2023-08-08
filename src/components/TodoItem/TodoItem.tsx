import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo?: (todoId: number) => void,
  updateTodo: (todo: Todo) => void,
  tempTodo?: Todo | null,
  loadingTodoIds: number[],
  setErrorMessage?: (message: string) => void,
};

export const TodoItem:React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodo,
  tempTodo,
  loadingTodoIds,
  setErrorMessage,
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
      setErrorMessage!("Title can't be empty");

      return;
    }

    if (editedTitle.trim() === '') {
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
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed || tempTodo?.completed,
      })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
          onClick={() => removeTodo?.(todo.id)}
        >
          ×
        </button>
      )}

      <div className={classNames('modal overlay', {
        'is-active': loadingTodoIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
