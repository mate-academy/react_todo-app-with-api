import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
  editTodo?: (todo: Todo, newTitle: string) => Promise<void>;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo = () => { },
  handleUpdateTodo = () => { },
  editTodo = () => Promise.resolve(),
  isLoading,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await editTodo(todo, title);

    setEditing(false);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames(
        ' todo ',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => handleUpdateTodo(todo)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
                setTitle(todo.title);
              }
            }}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditing(true);
              setTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            onChange={() => { }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
