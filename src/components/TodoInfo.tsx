/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState, useRef } from 'react';

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

export const TodoInfo: React.FC<Props> = ({
  todo: { completed, title, id },
  onDelete,
  todosInProcess,
  updateTodo,
}) => {
  const [selectTitle, setSelectTitle] = useState(title);
  const [changeTitle, setChangeTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectTitle(title);
    setChangeTitle(false);
  }, [title]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [changeTitle]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = selectTitle.trim();

    if (trimmedTitle === title) {
      setChangeTitle(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete(id);
    } else {
      updateTodo(id, trimmedTitle)?.then(() => {
        setSelectTitle(trimmedTitle);
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
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectTitle}
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
