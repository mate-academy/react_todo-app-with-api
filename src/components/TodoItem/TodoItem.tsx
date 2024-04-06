import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import './TodoItem.scss';
type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  toggleTodo: (todoToUpdate: Todo) => void;
  renameTodo: (todoToRename: Todo, newTitle: string) => void;
  processingIds?: number[];
};
export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  toggleTodo,
  renameTodo,
  processingIds,
}) => {
  //const [currentTodo, setCurrentTodo] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [editing, setEditing] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (!normalizedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    try {
      await renameTodo(todo, normalizedTitle);

      setEditing(false);
    } catch (error) {
      setEditing(true);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="Todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditing(true);
              setNewTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || processingIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
