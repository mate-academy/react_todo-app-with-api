import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo,
  selectedTodoIds: number[],
  onDelete: (todoId: number) => void,
  updateTodo: (updatedTodo: Todo) => Promise<void>,
  onError: (error: ErrorType) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodoIds,
  onDelete,
  updateTodo,
  onError,
}) => {
  const isLoading = selectedTodoIds.includes(todo.id) || todo.id === 0;
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [titleOnEdit, setTitleOnEdit] = useState(todo.title);

  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInput.current?.focus();
  }, [isBeingEdited]);

  const handleTodoStatusChange = async (todoToUpdate: Todo) => {
    const updatedTodo: Todo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    try {
      updateTodo(updatedTodo);
    } catch {
      onError(ErrorType.UnableToUpdate);
    }
  };

  const onEscKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
      setTitleOnEdit(todo.title);
    }
  };

  const onSubmitTitle = async (event: React.FormEvent) => {
    event.preventDefault();

    if (titleOnEdit === todo.title) {
      setIsBeingEdited(false);

      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: titleOnEdit.trim(),
    };

    if (!updatedTodo.title) {
      onDelete(todo.id);

      return;
    }

    try {
      await updateTodo(updatedTodo);
      setIsBeingEdited(false);
    } catch {
      onError(ErrorType.UnableToUpdate);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoStatusChange(todo)}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={onSubmitTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleOnEdit}
            ref={titleInput}
            onChange={(event) => setTitleOnEdit(event.target.value)}
            onKeyUp={onEscKeyUp}
            onBlur={onSubmitTitle}
          />
        </form>
      ) : (
        <>
          <span
            aria-hidden
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsBeingEdited(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
