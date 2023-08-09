import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loading: boolean,
  onDeleteTodo: (todoId: number) => void,
  onToggleTodoStatus: (todoId: number, completed: boolean) => void,
  onChangeTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDeleteTodo,
  onToggleTodoStatus,
  onChangeTodoTitle,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  const handleDeleteClick = () => {
    onDeleteTodo(todo.id);
  };

  const handleTodoStatusChange = () => {
    onToggleTodoStatus(todo.id, !todo.completed);
  };

  const titleChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditTitle = () => {
    setEditingTitle(true);
    if (!editedTitle) {
      onDeleteTodo(todo.id);
    } else if (editedTitle === todo.title) {
      setEditingTitle(false);
    }

    onChangeTodoTitle(todo.id, editedTitle);
    setEditingTitle(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditingTitle(false);
    }
  };

  useEffect(() => {
    if (editingTitle) {
      titleField.current?.focus();
    }
  }, [editingTitle, todo.id]);

  return (
    <li className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          ref={titleField}
          checked={todo.completed}
          onChange={handleTodoStatusChange}
          disabled={loading}
        />
      </label>

      {!editingTitle ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditingTitle(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <input
          type="text"
          className="todo__title-field"
          ref={titleField}
          value={editedTitle}
          onChange={titleChanger}
          onBlur={handleEditTitle}
          onKeyUp={handleKeyUp}
        />
      )}

      {loading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
