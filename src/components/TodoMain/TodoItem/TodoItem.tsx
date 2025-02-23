/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../../api/todos';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  isDataInProceeding: boolean;
  selectedTodoId?: number | null;
  isTodoTitleEditing: boolean;
  onTodoTitleEdit: (todoId: number) => void;
  changeEditingStatus: (editingStatus: boolean) => void;
  onUpdate: (todoToUpdate: Todo) => Promise<void>;
  onDelete: (todoId: number) => void;
  toggleStatus: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDataInProceeding,
  selectedTodoId,
  isTodoTitleEditing,
  onTodoTitleEdit,
  changeEditingStatus,
  onUpdate,
  onDelete,
  toggleStatus,
}) => {
  const [todoTitleWhileEdit, setTodoTitleWhileEdit] = useState<string>(
    todo.title,
  );
  const focusOnTitleEditing = useRef<HTMLInputElement | null>(null);

  const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitleWhileEdit(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (todo.title.trim() === todoTitleWhileEdit.trim()) {
      changeEditingStatus(false);
      setTodoTitleWhileEdit(prev => prev.trim());

      return;
    }

    if (todoTitleWhileEdit.trim().length === 0) {
      try {
        await onDelete(todo.id);
        changeEditingStatus(false);
      } catch {
        focusOnTitleEditing.current?.focus();
        changeEditingStatus(true);
      }

      return;
    }

    try {
      await onUpdate({
        id: todo.id,
        title: todoTitleWhileEdit.trim(),
        userId: USER_ID,
        completed: todo.completed,
      });
      changeEditingStatus(false);
      setTodoTitleWhileEdit(prev => prev.trim());
    } catch {
      changeEditingStatus(true);
      focusOnTitleEditing.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      changeEditingStatus(false);
      setTodoTitleWhileEdit(todo.title.trim());
    }
  };

  useEffect(() => {
    focusOnTitleEditing.current?.focus();
  });

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
        { active: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            toggleStatus(todo.id);
          }}
          disabled={isTodoTitleEditing}
        />
      </label>

      {isTodoTitleEditing && selectedTodoId === todo.id ? (
        <form onSubmit={onSubmit}>
          <input
            ref={focusOnTitleEditing}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleWhileEdit}
            onChange={handleFormInput}
            onKeyDown={handleKeyDown}
            onBlur={onSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onTodoTitleEdit(todo.id);
            }}
          >
            {todoTitleWhileEdit}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(todo.id);
            }}
            disabled={isTodoTitleEditing}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDataInProceeding && selectedTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
