import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorsMessages';

type Props = {
  todos: Todo[];
  todo: Todo;
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
  isSubmitting: boolean;
  onSubmit: (updateTodo: Todo | null) => void;
};

export const Todos: React.FC<Props> = ({
  todo,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onError,
  onIdTodo,
  isSubmitting,
  onSubmit,
}) => {
  const { title, userId, id, completed } = todo;
  const [updateTodo, setUpdateTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (updateTodo) {
      titleField.current?.focus();
    }
  }, [updateTodo]);

  const resetState = () => {
    setUpdateTodo(null);
    onIdTodo(0);
    onLoading(false);
  };

  const handleError = (errorType: string) => {
    onError(errorType);
    resetState();
  };

  const handleDoubleClick = () => {
    setUpdateTodo({ title, id, userId, completed });
    onIdTodo(id);
  };

  const handleDelete = () => {
    onIdTodo(id);
    onDelete(id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const handleChecked = async (event: ChangeEvent<HTMLInputElement>) => {
    onLoading(true);
    onIdTodo(id);

    const updateCompletedTodo = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      await onUpdate(updateCompletedTodo);
      resetState();
    } catch (error) {
      handleError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      resetState();

      return;
    }

    if (event.key === 'Enter' && !isSubmitting) {
      onLoading(true);

      try {
        if (!updateTodo?.title.trim()) {
          await onDelete(id);
        } else {
          await onSubmit(updateTodo);
        }

        resetState();
      } catch (error) {
        handleError(
          !updateTodo?.title.trim()
            ? ErrorMessages.UNABLE_TO_DELETE_TODO
            : ErrorMessages.UNABLE_TO_UPDATE_TODO,
        );
      }
    }
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdateTodo(currentTodo => {
      if (!currentTodo) {
        return null;
      }

      return {
        ...currentTodo,
        title: event.target.value,
      };
    });
  };

  const handleBlur = async () => {
    if (isSubmitting) {
      return;
    }

    onLoading(true);

    try {
      if (!updateTodo?.title.trim()) {
        await onDelete(id);
      } else {
        await onSubmit(updateTodo);
      }

      resetState();
    } catch (error) {
      handleError(
        !updateTodo?.title.trim()
          ? ErrorMessages.UNABLE_TO_DELETE_TODO
          : ErrorMessages.UNABLE_TO_UPDATE_TODO,
      );
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`} key={id}>
      {/* eslint-disable jsx-a11y/label-has-associated-control  */}
      <label className="todo__status-label" htmlFor={`${id}`}>
        <input
          id={`${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChecked}
        />
      </label>

      {updateTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            value={updateTodo?.title}
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleChangeTitle}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
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
          'is-active': id === idTodo && (isSubmitting || !updateTodo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
