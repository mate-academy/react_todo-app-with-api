import cn from 'classnames';

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isHover, setIsHover] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const {
    removeTodo,
    loadingMap,
    toggleTodo,
    editTodo,
  } = useContext(TodosContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && isEditingMode) {
      titleField.current.focus();
    }
  }, [isEditingMode]);

  const hadnleTitleChange = () => {
    if (newTitle !== title) {
      if (newTitle.trim()) {
        editTodo(todo, newTitle.trim())
          .then(() => setIsEditingMode(false))
          .catch(() => setIsEditingMode(true));
      } else {
        removeTodo(id);
      }
    }

    setIsEditingMode(false);
  };

  const handleTodoEditing = (event: React.FormEvent) => {
    event.preventDefault();

    hadnleTitleChange();
  };

  const handleEscEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditingMode(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDoubleClick={() => setIsEditingMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {!isEditingMode ? (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      ) : (
        <form onSubmit={handleTodoEditing}>
          <input
            data-cy="TodoTitleField"
            ref={titleField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyUp={handleEscEditing}
            onBlur={hadnleTitleChange}

          />
        </form>
      )}

      {!isEditingMode && (
        <button
          type="button"
          className={cn('todo__remove', {
            'is-visible': !isHover,
          })}
          data-cy="TodoDelete"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (loadingMap as { [key: number]: boolean })[id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
