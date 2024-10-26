/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classNames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef } from 'react';

interface Props {
  todo: Todo;
  index: number;
  selectedTodoId: number[];
  isEditing: number | null;
  newTitle: string;
  onDelete: (value: number) => void;
  onToggle: (value: number, index: number) => void;
  onStartEditing: (value: string, id: number) => void;
  onNewTodoTitle: (value: string) => void;
  onChangeTodoTitle: (
    event: React.FormEvent,
    todo: Todo,
    index: number,
  ) => void;
  onKey: (event: React.KeyboardEvent) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  index,
  selectedTodoId,
  newTitle,
  isEditing,
  onDelete,
  onToggle,
  onStartEditing,
  onNewTodoTitle,
  onChangeTodoTitle,
  onKey,
}) => {
  const newTitleFiled = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentField = newTitleFiled.current;

    if (currentField !== null) {
      currentField.focus();
    }
  }, [newTitleFiled, isEditing]);
  const { id, title, completed } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          data-todoId={id}
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onToggle(id, index)}
        />
      </label>
      {isEditing === id ? (
        <form onSubmit={event => onChangeTodoTitle(event, todo, index)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => onNewTodoTitle(event?.target.value)}
            onBlur={event => onChangeTodoTitle(event, todo, index)}
            onKeyUp={onKey}
            ref={newTitleFiled}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onStartEditing(title, id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': selectedTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
