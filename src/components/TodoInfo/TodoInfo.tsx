import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorHandler } from '../../types/ErrorHandler';

interface Props {
  todo: Todo;
  isAdding: boolean
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, status: boolean) => void;
  changeTitle: (todoId: number, title: string) => void;
  setError:(error: ErrorHandler) => void;
  getTodos: () => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  onDelete,
  toggleTodo,
  changeTitle,
  setError,
  getTodos,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditingAvailable, setIsEditingAvailable]
    = useState(false);
  const [newTitle, setNewTitle] = useState(title.trim());
  const editingField = useRef<HTMLInputElement>(null);

  const handleToggleTodo = useCallback(() => {
    toggleTodo(id, !completed);
  }, [completed]);

  const handleNewTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(event.target.value);
    }, [],
  );

  const changeTodoTitle = useCallback(
    async () => {
      try {
        const trimmedTitle = newTitle.trim();

        setIsEditingAvailable(false);

        if (trimmedTitle === title) {
          return;
        }

        if (trimmedTitle === '') {
          throw new Error(ErrorHandler.EmptyTitle);
        }

        await changeTitle(id, trimmedTitle);
        await getTodos();
      } catch (e) {
        if (e === ErrorHandler.EmptyTitle) {
          setError(ErrorHandler.EmptyTitle);
        } else {
          setError(ErrorHandler.PatchError);
        }
      }
    }, [newTitle],
  );

  const handleSubmitChange = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
      changeTodoTitle();
    }, [changeTodoTitle],
  );

  const handleInputBLurChange = useCallback(
    () => {
      changeTodoTitle();
    }, [changeTodoTitle],
  );

  const handleKeyDownChange = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditingAvailable(false);
        setNewTitle(title);
      }
    }, [title],
  );

  useEffect(() => {
    if (editingField.current) {
      editingField.current.focus();
    }
  }, [isEditingAvailable]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={handleToggleTodo}
        />
      </label>
      {isEditingAvailable
        ? (
          <form onSubmit={handleSubmitChange}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={editingField}
              className="todo__title-field"
              value={newTitle}
              onChange={handleNewTitleChange}
              onKeyDown={handleKeyDownChange}
              onBlur={handleInputBLurChange}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditingAvailable(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isAdding })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
