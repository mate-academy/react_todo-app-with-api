import classNames from 'classnames';
import { useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = (props) => {
  const { todo, onDelete } = props;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (todoId: number) => {
    setIsDeleting(true);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          onDelete(todoId);
        }
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
