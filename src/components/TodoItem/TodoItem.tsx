/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: Todo) => void;
  isLoading: boolean;
  onRename?: (todo: Todo) => Promise<void>;
  setIdsProccesing?: Dispatch<SetStateAction<number[]>>;
}
export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  isLoading,
  onRename,
  setIdsProccesing,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsRenaming(false);

      return;
    }

    if (!trimmedNewTitle) {
      onDelete?.(todo.id);

      return;
    }

    onRename?.({ ...todo, title: trimmedNewTitle })
      ?.then(() => setIsRenaming(false))
      .catch(() => {})
      .finally(() => {
        setIdsProccesing?.(current => current.filter(id => id !== todo.id));
      });
  };

  const { id, completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      {isRenaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={e => (e.key === 'Escape' ? setIsRenaming(false) : '')}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setNewTitle(title);
              setIsRenaming(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
