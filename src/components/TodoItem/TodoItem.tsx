import { FC } from 'react';
import classNames from 'classnames';
import { Todo, UpdateTodoFragment } from '../../types/Todo';

interface Props {
  todo: Todo;
  onChange: (value: number, status: UpdateTodoFragment) => void;
  onDelete: (todoId: number) => void;
}

export const TodoItem: FC<Props> = (props) => {
  const { todo, onChange, onDelete } = props;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onChange(todo.id, { completed: !todo.completed })}
          // defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
