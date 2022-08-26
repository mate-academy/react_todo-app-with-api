import classNames from 'classnames';
import { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo, UpdateTodoframent } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: UpdateTodoframent) => void;
}

export const TodoItem: React.FC<Props> = (props) => {
  const { todo, onDelete, onUpdate } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(res => {
        if (res) {
          onDelete(todoId);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdate = (todoId: number, data: UpdateTodoframent) => {
    setIsLoading(true);

    updateTodo(todoId, data)
      .then(res => {
        if (res) {
          onUpdate(todoId, data);
        }
      })
      .finally(() => setIsLoading(false));
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
          onClick={() => handleUpdate(todo.id, { completed: !todo.completed })}
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
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
