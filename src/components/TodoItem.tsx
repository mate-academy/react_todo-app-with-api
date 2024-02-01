import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todo: Todo;
  onDelete: () => void;
  onUpdate: (t: Todo) => void;
};

export const TodoItem: React.FC<Props>
= ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const [editingTitle, setEdingTitle] = useState(todo.title);
  const [isEnding, setIsEnding] = useState(false);

  const handelDubleClick = () => {
    setIsEnding(true);
  };

  const handelTitleChenge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdingTitle(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEnding(false);
    if (editingTitle.trim().length === 0) {
      onDelete();
    } else {
      onUpdate({ ...todo, title: todo.title });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handelChangeStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    onUpdate(updatedTodo);

    return updatedTodo;
  };

  return (
    <li
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handelChangeStatus}
        />
      </label>

      {isEnding ? (
        <input
          type="text"
          className="todo__input"
          value={todo.title}
          onChange={handelTitleChenge}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handelDubleClick}
        >
          {todo.title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete()}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
