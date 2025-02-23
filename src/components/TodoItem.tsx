/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';
type Props = {
  todo: Todo;
  onDelete: (postId: number) => Promise<unknown>;
  todosInProcess: number[];
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
};
export const TodoItem: React.FC<Props> = ({
  todo: { completed, title, id },
  onDelete,
  todosInProcess,
  updateTodo,
}) => {
  const [selectTitle, setSelectTitle] = useState(title);
  const [changeTitle, setChangeTitle] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = selectTitle.trim();

    if (trimmedTitle === '') {
      onDelete(id);
    } else {
      setChangeTitle(false);
      updateTodo(id, trimmedTitle)
        ?.then(() => {
          setSelectTitle(trimmedTitle);
        })
        .catch(() => {
          setChangeTitle(true);
        });
    }
  };

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateTodo(id, selectTitle, event.target.checked);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectTitle(title);
      setChangeTitle(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeChecked}
        />
      </label>
      {changeTitle ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectTitle}
            autoFocus
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={event => setSelectTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setChangeTitle(true)}
          >
            {selectTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosInProcess.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
