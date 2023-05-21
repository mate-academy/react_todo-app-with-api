import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { UpdateDataTodo } from '../../types/UpdateDataTodo';

interface P {
  todo: Todo;
  isLoading?: boolean;
  deleteTodo: (id: number) => void;
  updateTodoCompleted: (todoId: number, data: UpdateDataTodo) => void;
  updateTitle: (title: string, todoId: number) => void;
}

export const TodoInfo: React.FC<P> = ({
  todo,
  isLoading = false,
  deleteTodo,
  updateTodoCompleted,
  updateTitle,
}) => {
  const { completed, title, id } = todo;
  const [isCurrentlyEditing, setIsCurrentlyEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title === editingTitle) {
      setIsCurrentlyEditing(false);

      return;
    }

    setIsCurrentlyEditing(false);

    updateTitle(editingTitle, id);
  };

  useEffect(() => {
    if (isCurrentlyEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCurrentlyEditing]);
  const handleInputKeyUpEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsCurrentlyEditing(false);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => updateTodoCompleted(id, { completed: !completed })}
        />
      </label>

      {isCurrentlyEditing
        ? (
          <form onSubmit={handleSubmit} onBlur={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              // autoFocus={isCurrentlyEditing}
              ref={inputRef}
              onKeyUp={handleInputKeyUpEscape}
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => setIsCurrentlyEditing(true)}
          >
            {title}
          </span>
        )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal', 'overlay',
        { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
