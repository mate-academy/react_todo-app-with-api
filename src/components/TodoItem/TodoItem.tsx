import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo, TodoData } from '../../types';

type Props = {
  todo: Todo,
  onDelete: () => void,
  onUpdate: (data: TodoData) => void,
  beingProcessed?: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  onUpdate,
  beingProcessed = false,
}) => {
  const { title, completed } = todo;
  const [beingEdited, setBeingEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const todoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => setBeingEdited(true), []);
  const finishEditing = useCallback(() => setBeingEdited(false), []);

  useEffect(() => {
    todoRef.current?.addEventListener('dblclick', startEditing);

    return () => todoRef.current?.removeEventListener('dblclick', startEditing);
  }, []);

  useEffect(() => {
    if (beingEdited) {
      inputRef.current?.focus();
    }
  }, [beingEdited]);

  const handleToggle = () => {
    onUpdate({ completed: !todo.completed });
  };

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value.trimStart());
  }, []);

  const handleRename = (event: FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      onDelete();

      return;
    }

    if (title !== newTitle) {
      onUpdate({ title: newTitle });
    }

    finishEditing();
  };

  return (
    <div
      ref={todoRef}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {beingEdited
        ? (
          <form
            onSubmit={handleRename}
          >
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleInput}
              onBlur={handleRename}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': beingProcessed },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
