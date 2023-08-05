import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onRemoveTodo?: (todoId: number) => void
  onCheckedTodo?: (todoId: number) => void
  loading?: boolean
  isSelectedTodo?: number | null | undefined
  onSelectedTodo?: (id: number | null) => void
  handleEditTodo?: (modifiedTodo: string, id: number) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  onCheckedTodo,
  loading,
  isSelectedTodo,
  onSelectedTodo,
  handleEditTodo,
}) => {
  const { title, id } = todo;
  const [renameTodo, setRenameTodo] = useState<string>(title);

  const handleRenameTodo = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRenameTodo(e.target.value);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    if (renameTodo !== title && handleEditTodo) {
      handleEditTodo(renameTodo, id);
    }

    if (onSelectedTodo) {
      onSelectedTodo(null);
    }
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Escape') {
      setRenameTodo(title);
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (renameTodo !== title && handleEditTodo) {
      handleEditTodo(renameTodo, id);
    }

    if (onSelectedTodo) {
      onSelectedTodo(null);
    }
  };

  return (
    <>
      <form
        key={id}
        className={`todo ${todo.completed && 'completed'}`}
        onSubmit={handleSubmit}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={() => onCheckedTodo && onCheckedTodo(id)}
          />
        </label>

        {isSelectedTodo === id
          ? (
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={renameTodo}
              onChange={handleRenameTodo}
              onKeyUp={handleKeyUp}
              onBlur={handleBlur}
            />
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => onSelectedTodo && onSelectedTodo(id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onRemoveTodo && onRemoveTodo(todo.id)}
              >
                ×
              </button>

              {loading && (
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              ) }
            </>
          )}

      </form>
    </>
  );
};
