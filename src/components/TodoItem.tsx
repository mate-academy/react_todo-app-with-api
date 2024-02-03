import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todo: Todo;
  onDelete: () => void;
  onUpdate: (t: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todos,
  todo,
  onDelete,
  onUpdate,
  setTodos,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [isEnding, setIsEnding] = useState(false);

  const handleDoubleClick = () => {
    setIsEnding(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEnding(false);

    if (editingTitle.trim().length === 0) {
      onDelete();
    } else {
      const titleExists = todos.some((t) => t.title === editingTitle);

      if (titleExists) {
        const filteredTodos = todos.filter((t) => t.title !== editingTitle);

        setTodos(filteredTodos);
        onDelete();
      } else {
        onUpdate({ ...todo, title: editingTitle });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleChangeStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    onUpdate(updatedTodo);

    return updatedTodo;
  };

  return (
    <li data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleChangeStatus}
        />
      </label>

      {isEnding ? (
        <input
          type="text"
          className="todo__input"
          value={editingTitle}
          onChange={handleTitleChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete()}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
