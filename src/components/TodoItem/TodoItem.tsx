/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useState } from 'react';
import { RenamingForm } from '../RenamingForm';

type TodoItemProps = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (newTodo: Todo) => void;
};

export const TodoItem = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}: TodoItemProps) => {
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setRenaming(false);
    }
  }

  function handleSave() {
    const preparedNewTitle = newTitle.trim();

    if (preparedNewTitle === todo.title) {
      setRenaming(false);

      return;
    }

    if (preparedNewTitle.length === 0) {
      onDelete?.(todo.id);

      return;
    }

    onUpdate?.({ ...todo, title: preparedNewTitle });
  }

  useEffect(() => {
    setRenaming(false);
  }, [todo.title]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.({ ...todo, completed: !todo.completed })}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}
      {renaming === true ? (
        <RenamingForm
          newTitle={newTitle}
          onChange={setNewTitle}
          onSave={handleSave}
          onCancel={handleKeyUp}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setRenaming(true)}
          >
            {isLoading ? newTitle : todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        {' '}
        {/*is-active*/}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
