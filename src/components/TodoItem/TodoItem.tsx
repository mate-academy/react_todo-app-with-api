import classnames from 'classnames';
import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingTodoIds: number[],
  onToggle: (todo: Todo) => void,
  onUpdate: (todoId: number, newTodoTitle: string) => void,
  onDelete: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  loadingTodoIds,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [titleEdit, setTitleEdit] = useState<string>(todo.title);

  const editTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  });

  const submitTodoHandler = () => {
    if (!titleEdit.trim()) {
      return onDelete(todo.id);
    }

    if (todo.title === titleEdit) {
      return setIsEditing(false);
    }

    onUpdate(todo.id, titleEdit);

    return setIsEditing(false);
  };

  const onKeyPressHandler = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setTitleEdit(todo.title);
      setIsEditing(false);
    }
  };

  const { title, completed } = todo;

  return (
    <>
      <div
        data-cy="Todo"
        className={
          classnames(
            'todo',
            { completed },
          )
        }
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => onToggle(todo)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={event => {
            event.preventDefault();
            submitTodoHandler();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editTodoField}
              value={titleEdit}
              onChange={(event => setTitleEdit(event.target.value))}
              onBlur={() => submitTodoHandler()}
              onKeyDown={onKeyPressHandler}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>

        )}

        <div
          data-cy="TodoLoader"
          className={
            classnames(
              'modal',
              'overlay',
              { 'is-active': loadingTodoIds.includes(todo.id) },
            )
          }
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
