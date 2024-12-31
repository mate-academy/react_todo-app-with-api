/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  todoIds: number[];
  tempTodo?: Todo | null;
  toggleTodoStatus: (todo: Todo) => void;
  setTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: (value: string | null) => void;
  isTodoUpdated: boolean;
};

const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  todoIds,
  tempTodo,
  toggleTodoStatus,
  setTodoIds,
  setErrorMessage,
  isTodoUpdated,
}) => {
  const { completed, id, title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTodoUpdated) {
      setIsEditing(false);
    }
  }, [isTodoUpdated]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTodoIds(prevIds => [...prevIds, todo.id]);

    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id);
    } else if (trimmedTitle !== todo.title) {
      const updatedTodo = { ...todo, title: trimmedTitle };

      updateTodo(updatedTodo)
        .then(() => {
          setEditedTitle(trimmedTitle);
          setIsEditing(false);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() =>
          setTodoIds(prevIds => prevIds.filter(t => t !== todo.id)),
        );
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={!!tempTodo}
          onChange={() => toggleTodoStatus(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            type="text"
            ref={inputRef}
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editedTitle.trim()}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoIds.includes(id) || tempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
