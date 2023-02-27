import React, {
  memo,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: (todoId: number) => void,
  isBeingLoading: boolean,
  onUpdate: (props: Partial<Todo>) => void,
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onRemove,
  isBeingLoading,
  onUpdate,
}) => {
  const { title, completed, id } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isInputShowing, setIsInputShowing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsInputShowing(false);
      setNewTitle(title.trim());
    }
  };

  const handleStatus = () => {
    onUpdate({ completed: !todo.completed });
  };

  const handleRename = () => {
    if (!newTitle.trim()) {
      onRemove(id);

      return;
    }

    if (title !== newTitle) {
      onUpdate({ title: newTitle.trim() });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRename();
    setIsInputShowing(false);
    setNewTitle(newTitle.trim());
  };

  useEffect(() => {
    if (isInputShowing) {
      inputRef.current?.focus();
    }
  }, [isInputShowing]);

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatus}
        />
      </label>

      {isInputShowing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleCancelEdit}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsInputShowing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )}
      <div className={classNames(
        'modal overlay',
        { 'is-active': isBeingLoading },
      )}
      >

        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
