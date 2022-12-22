import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => Promise<void>,
  activeTodoId: number[],
  onUpdateTodoStatus: (todoId: number, todo: Partial<Todo>) => Promise<void>,
  onDeleteTodo: (todoId: number) => Promise<void>,
  isAdding: boolean,
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  activeTodoId,
  onUpdateTodoStatus,
  onDeleteTodo,
  isAdding,
}) => {
  const { id, title, completed } = todo;
  const titleInputField = useRef<HTMLInputElement>(null);

  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const cancelUpdating = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsTitleUpdating(false);
      setNewTitle(title);
    }
  }, [newTitle, isTitleUpdating]);

  const submitNewTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim() === title) {
      setNewTitle(title);
      setIsTitleUpdating(false);
    } else if (newTitle.trim() === '') {
      onDeleteTodo(id);
      setIsTitleUpdating(false);
    } else {
      onUpdateTodoStatus(id, { title: newTitle.trim() });
      setIsTitleUpdating(false);
    }
  }, [newTitle]);

  useEffect(() => {
    if (titleInputField.current) {
      titleInputField.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onUpdateTodoStatus(
            id, { completed: !completed },
          )}
        />
      </label>

      {isTitleUpdating
        ? (
          <form
            onSubmit={submitNewTitle}
            onBlur={submitNewTitle}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleInputField}
              defaultValue={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyDown={cancelUpdating}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleUpdating(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => (
                onDelete(id)
              )}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay',
          {
            'is-active': (activeTodoId.includes(id) && !isAdding)
              || (!activeTodoId.includes(id) && isAdding),
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
