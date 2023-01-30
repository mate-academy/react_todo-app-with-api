import classNames from 'classnames';
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding: boolean;
  onDeleteItem: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  onRenameTodo: (todo: Todo, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  onDeleteItem,
  onToggleTodo,
  onRenameTodo,
}) => {
  const { completed, id, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const currentTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentTitle.current) {
      currentTitle.current.focus();
    }
  });

  const onSuccessfulEdit = useCallback(() => {
    onRenameTodo(todo, newTitle);
    setIsEditing(false);
  }, [newTitle]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSuccessfulEdit();
  };

  const onPressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(title);
      }
    }, [],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => onToggleTodo(id, completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={onFormSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={currentTitle}
            placeholder="The empty placeholder will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={onSuccessfulEdit}
            onKeyDown={onPressEsc}
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
            onClick={() => onDeleteItem(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isAdding })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
