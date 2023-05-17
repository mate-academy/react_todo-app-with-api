import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  todoId: number | null;
  onDelete: (id: number) => void;
  setTodoId: (id: number | null) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  todoId,
  onDelete,
  setTodoId,
  onChangeStatus,
}) => {
  const { id, title, completed } = todo;

  const handleDelete = (selectedTodoId: number) => {
    setTodoId(selectedTodoId);
    onDelete(selectedTodoId);
  };

  const handleChangeStatus = (selectedTodoId: number) => {
    setTodoId(selectedTodoId);
    onChangeStatus(selectedTodoId, !completed);
  };

  return (
    <div
      key={id}
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeStatus(id)}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', { 'is-active': todoId === id })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
