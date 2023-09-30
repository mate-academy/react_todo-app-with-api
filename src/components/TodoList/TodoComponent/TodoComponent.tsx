import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { useTodosProvider } from '../../../providers/TodosContext';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type TodoComponentProps = {
  todo: Todo;
};

export const TodoComponent: React.FC<TodoComponentProps> = ({ todo }) => {
  const {
    doubleClickHandler,
    toggleCompleted,
    handleRemove,
  } = useTodosProvider();

  const handleToggleCompleted = () => {
    toggleCompleted(todo.id);
  };

  const handleDoubleClick = () => {
    doubleClickHandler(todo.id);
  };

  const handleDelete = () => {
    handleRemove(todo.id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          title="checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader todo={todo} />
    </div>
  );
};
