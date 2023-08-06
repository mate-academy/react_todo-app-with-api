import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  updateTodo: (todoId: number, args: Partial<Todo>) => Promise<void>,
  deleteTodo: (todoId: number) => Promise<void>,
  loadingIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  deleteTodo,
  loadingIds,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEdited]);

  const handleDeleteTodoById = async () => {
    await deleteTodo(todo.id);
    setIsEdited(false);
  };

  const changeStatus = async (
    todoId: number, args: Partial<Todo>,
  ): Promise<void> => {
    await updateTodo(todoId, args);
  };

  const updateTitle = async (
    event?: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    if (event) {
      event.preventDefault();
    }

    if (todo.title === editedTitle) {
      setIsEdited(false);

      return;
    }

    if (editedTitle.length === 0) {
      await handleDeleteTodoById();

      return;
    }

    await updateTodo(todo.id, { title: editedTitle });

    setIsEdited(false);
  };

  const onEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEdited(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={async () => {
            await changeStatus(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {!isEdited ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodoById()}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={updateTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={async () => {
              await updateTitle();
            }}
            onKeyUp={onEscape}
            ref={titleField}
          />
        </form>
      )}

      <div className={cn('modal overlay', {
        'is-active': loadingIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
