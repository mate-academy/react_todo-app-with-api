/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo.js';
import cn from 'classnames';
import { useRef } from 'react';

interface Props {
  todo: Todo;
  loading: number[] | null;
  onDelete?: (id: number[]) => Promise<void>;
  onEdit: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoUser: React.FC<Props> = ({
  todo,
  loading,
  onDelete =  async () => {},
  onEdit,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTodo && todoField.current) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsEditingTodo({ ...isEditingTodo, title: e.target.value } as Todo);
  };

  const handleTitleUpdate = (newTodo: Todo) => {
    onEdit(todo.id, newTodo).then(() => setIsEditingTodo(null));
  };

  const handleEvent = (eventKey?: string) => {
    const event = eventKey === undefined || eventKey === 'Enter';

    if (event && isEditingTodo && isEditingTodo.title.length > 0) {
      if (isEditingTodo.title.trim() !== todo.title) {
        handleTitleUpdate({ ...isEditingTodo, title: title.trim() });
      } else {
        setIsEditingTodo(null);
      }
    }

    if (event && isEditingTodo?.title.length === 0) {
      onDelete([isEditingTodo.id]);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleEvent(e.key);

    if (e.key === 'Escape') {
      setIsEditingTodo(null);
    }
  };

  const handleBlur = () => {
    handleEvent();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', 'item-enter-done', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onEdit(todo.id, { completed: !todo.completed })}
          checked={todo.completed}
        />
      </label>
      {isEditingTodo?.id === todo.id ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTodo(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete([todo.id]).catch(() => {})}
          >
            ×
          </button>{' '}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
