import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo,
  loadingTodosId: number[],
  handleDeleteTodo: (todoId: number) => void
  handleTodoUpdate: (todoId: number, data: any) => void,
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodosId,
  handleDeleteTodo,
  handleTodoUpdate,
}) => {
  const { id, completed, title } = todo;

  const [isTodoBeingEditing, setIsTodoBeingEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputField = useRef<HTMLInputElement>(null);

  const handleSubmitNewTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTitle === title) {
      return setIsTodoBeingEditing(false);
    }

    if (!newTitle) {
      return handleDeleteTodo(id);
    }

    handleTodoUpdate(id, { title: newTitle });

    return setIsTodoBeingEditing(false);
  };

  const handleChangeNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleBlur = () => {
    handleTodoUpdate(id, { title: newTitle });
    setIsTodoBeingEditing(false);
  };

  useEffect(() => {
    if (isTodoBeingEditing && inputField.current) {
      inputField.current.focus();
    }
  }, [isTodoBeingEditing]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleTodoUpdate(id, { completed: !completed })}
        />
      </label>

      {isTodoBeingEditing
        ? (
          <form
            onSubmit={handleSubmitNewTitle}
          >
            <input
              ref={inputField}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleChangeNewTitle}
              onBlur={handleBlur}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsTodoBeingEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames('modal overlay', {
          'is-active': loadingTodosId
            .filter(todoId => id === todoId).length,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
