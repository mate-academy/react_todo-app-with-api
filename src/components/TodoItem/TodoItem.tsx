import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onRemoveTodo?: (todoId: number) => void
  onCheckedTodo?: (todoId: number) => void
  loading?: boolean
  isSelectedTodo?: boolean
  onSelectedTodo?: (id: number) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  onCheckedTodo,
  loading,
  isSelectedTodo,
  onSelectedTodo,
}) => {
  const { title, id } = todo;
  const [renameTodo, setRenameTodo] = useState<string>(title);

  const handleTargetTodo = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRenameTodo(e.target.value);
  };

  return (
    <>
      <div
        key={id}
        className={`todo ${todo.completed && 'completed'}`}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={() => onCheckedTodo && onCheckedTodo(id)}
          />
        </label>

        {isSelectedTodo
          ? (
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={renameTodo}
              onChange={handleTargetTodo}
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

      </div>
    </>
  );
};
