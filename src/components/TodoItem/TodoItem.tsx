import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodoByTodoId } from '../../api/todos';

type Props = {
  todo: Todo,
  handleError: (errorMsg: string) => void,
  handleUpdate: (bool: boolean) => void,
};

export const TodoItem: FC<Props> = ({ todo, handleError, handleUpdate }) => {
  const { id, completed } = todo;
  const handleRemoveTodo = () => {
    removeTodoByTodoId(id)
      .then(() => handleUpdate(true))
      .catch(() => handleError('Unable to delete a todo'));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemoveTodo}
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
