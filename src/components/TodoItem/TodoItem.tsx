import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => Promise<void>;
  isLoading?: boolean;
  renameTodo: (id: number, newTitle: string) => Promise<void>;
  toggleTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isLoading,
  renameTodo,
  toggleTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.title);
  const titleField = useRef<HTMLInputElement | null>(null);

  const renameTodoFunction = async (): Promise<void> => {
    try {
      if (!!editingText.trim().length) {
        await renameTodo(todo.id, editingText);
        setEditingText(editingText.trim());
        setEditing(false);
      } else {
        await removeTodo(todo.id);
        setEditing(true);
      }
    } catch (error) {
      setEditing(true);
      if (titleField.current) {
        titleField.current.focus();
      }

      throw error;
    }
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      renameTodoFunction();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setEditingText(todo.title);
    }
  };

  const handleBlur = () => {
    renameTodoFunction();

    if (!editingText.trim().length) {
      if (titleField.current) {
        titleField.current.focus();
      }
    }
  };

  const handleRemoving = () => {
    removeTodo(todo.id);
  };

  useEffect(() => {
    if (editing && titleField.current) {
      titleField.current.focus();
    }
  }, [editing]);

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {editing ? (
        <input
          ref={titleField}
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          onChange={e => setEditingText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          value={editingText}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editingText}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoving}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={isLoading} />
    </div>
  );
};
