import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todo: Todo,
  todoDeleteButton: (todoId: number) => void;
  onChangeStatus: (todo: Todo) => void;
  usingUpdatesId: number[],
  setError: (message: string) => void;
  updateTodo: (
    todo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  todoDeleteButton,
  onChangeStatus,
  usingUpdatesId,
  updateTodo,
  setError,
}) => {
  const [selectedTodo, setSelectedTodo] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [hasError, setHasError] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && selectedTodo) {
      titleField.current.focus();
    }
  }, [selectedTodo]);

  const hendleStartEditTodo = () => {
    setSelectedTodo(true);
    setEditTitle(todo.title);
    setHasError(false);
  };

  const handleEditCancel = () => {
    setSelectedTodo(false);
    setEditTitle('');
    setHasError(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      if (hasError) {
        setError(ErrorMessage.UnableUpdate);
      } else {
        handleEditCancel();
      }
    } else if (trimmedTitle) {
      updateTodo(
        {
          ...todo,
          title: trimmedTitle,
        },
        () => {
          setHasError(false);
          handleEditCancel();
        },
        () => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setHasError(true);
          setError(ErrorMessage.UnableUpdate);
        },
      );
    } else {
      todoDeleteButton(todo.id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChangeStatus(todo)}
        />
      </label>

      {selectedTodo ? (
        <form onSubmit={handleEdit} onBlur={handleEdit}>
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={hendleStartEditTodo}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => todoDeleteButton(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay', {
            'is-active': usingUpdatesId.includes(todo.id) || todo.id === 0,
          },
        )}
      >
        <div
          className="
          modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
