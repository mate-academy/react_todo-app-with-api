import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todo: Todo;
  onDelete: () => void;
  onUpdate: (todo: Todo) => void;
};

const TodoItem: React.FC<Props> = ({
  todos, todo, onDelete, onUpdate,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === '') {
      onDelete();
    } else if (trimmedTitle !== todo.title) {
      const titleExists = todos.some((t) => t.title === trimmedTitle);

      if (!titleExists) {
        onUpdate({ ...todo, title: trimmedTitle });
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleChangeStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    onUpdate(updatedTodo);
  };

  return (
    <li
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__input"
          value={editingTitle}
          onChange={handleTitleChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
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
        onClick={onDelete}
      >
        ×
      </button>
    </li>
  );
};

export default TodoItem;
