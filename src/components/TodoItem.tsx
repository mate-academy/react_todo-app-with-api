/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onSave: (todoId: number, newTitle: string, completed: boolean) => Promise<void>;
  toggleTodoCompletion: (todoId: number) => void;
  deleteSingleTodo: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoCompletion,
  onSave,
  deleteSingleTodo,
  loadingTodoIds,
}) => {
  const { title, id, completed } = todo;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const focus = useRef<HTMLInputElement>(null);


  const handleSave = async () => {
    if (!newTitle.trim()) {
      await deleteSingleTodo(todo.id)
        .then(
          () => {
            setEditing(false);
        }
      )
    } else if (newTitle.trim() !== title.trim()) {
      await onSave(id, newTitle, completed)
        .then(() => {
          setEditing(false);
        })
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setNewTitle(title);
    }
  };


    useEffect(() => {
      if (focus.current) {
        focus.current.focus();
      }
    }, [editing]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
        onDoubleClick={handleDoubleClick}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => toggleTodoCompletion(id)}
            autoFocus
          />
        </label>
        {/* This is a completed todo */}
        {editing ? (
          <form onSubmit={e => e.preventDefault()}>
            <input
              ref={focus}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleSave}
              onKeyUp={handleKeyUp}
              // autoFocus
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteSingleTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loadingTodoIds.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
