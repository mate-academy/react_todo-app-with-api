import classNames from 'classnames';
import React, {
  ChangeEvent, FormEvent, useEffect, useRef,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onRemoveTodo?: (todoId: number) => void;
  onUpdateStatus?: (todo: Todo) => void;
  onSetEditTodoId?: (todoId: number | null) => void;
  editTodoId?: number | null;
  onSetNewTitle?: (title: string) => void;
  newTitle?: string;
  onUpdateTitle?: (todo: Todo, cancel?: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  isProcessing,
  onUpdateStatus,
  onSetEditTodoId,
  editTodoId,
  onSetNewTitle,
  newTitle,
  onUpdateTitle,
}) => {
  const { title, completed, id } = todo;
  const editTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (editTitle.current) {
      editTitle.current.focus();
    }
  }, [editTodoId]);

  const handleUpdateStatusInput = () => {
    if (onUpdateStatus) {
      onUpdateStatus(todo);
    }
  };

  const handleRemoveButton = () => {
    if (onRemoveTodo) {
      onRemoveTodo(id);
    }
  };

  const handleNewTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (onSetNewTitle) {
      onSetNewTitle(event.target.value);
    }
  };

  const handleNewTitleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onUpdateTitle) {
      onUpdateTitle(todo);
    }
  };

  const handleDoubleClickTitle = () => {
    if (onSetEditTodoId && onSetNewTitle) {
      onSetEditTodoId(id);
      onSetNewTitle(title);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape' && onUpdateTitle) {
      onUpdateTitle(todo, true);
    }
  };

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
          checked={completed}
          onChange={handleUpdateStatusInput}
        />
      </label>

      {editTodoId === id
        ? (
          <form
            onSubmit={handleNewTitleSubmit}
            onBlur={handleNewTitleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleNewTitleInput}
              onKeyDown={handleKeyDown}
              ref={editTitle}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClickTitle}
            >
              {isProcessing && newTitle?.length ? newTitle : title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleRemoveButton}
            >
              ×
            </button>
          </>
        )}

      {isProcessing && <TodoLoader />}
    </div>
  );
};
