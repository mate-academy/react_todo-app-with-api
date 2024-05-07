/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoType } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: TodoType;
  isTemp?: boolean;
  deleteTodo: (todoId: number) => Promise<boolean>;
  markTodo(todoId: number, newStatus: boolean): Promise<boolean>;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
};

export default function Todo({
  todo,
  isTemp,
  deleteTodo,
  markTodo,
  renameTodo,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  function handleButtonClick() {
    setIsSaving(true);

    deleteTodo(todo.id).then(() => {
      setIsSaving(false);
    });
  }

  function handleCheckboxClick() {
    setIsSaving(true);

    markTodo(todo.id, !todo.completed).then(() => {
      setIsSaving(false);
    });
  }

  function handleTitleDoubleClick() {
    setIsEditing(true);
  }

  function handleInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setNewTitle(target.value);
  }

  function handleInputBlur() {
    if (newTitle.trim() !== todo.title) {
      if (newTitle.trim() === '') {
        handleButtonClick();
      }

      setIsSaving(true);
      renameTodo(todo.id, newTitle.trim()).then(hasSucceeded => {
        if (hasSucceeded) {
          setIsEditing(false);
        }

        setIsSaving(false);
      });
    } else {
      setIsEditing(false);
    }
  }

  document.body.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  });

  return (
    <div
      data-cy="Todo"
      className={'todo' + (todo.completed ? ' completed' : '')}
    >
      <label
        onClick={handleCheckboxClick}
        className="todo__status-label"
        htmlFor="input"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          readOnly
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleInputBlur();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleTitleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleButtonClick}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={'modal overlay' + (isTemp || isSaving ? ' is-active' : '')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
