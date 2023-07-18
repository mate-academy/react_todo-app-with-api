import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  loadingTodos: number[];
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[] | []>>;
  deleteTodo: (todoId: number) => void;
  toggleTodo: (todoId: number, data: UpdateTodoArgs) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  todos,
  loadingTodos,
  setLoadingTodos,
  deleteTodo,
  toggleTodo,
  setTodos,
  setError,
}) => {
  const {
    id, title, completed,
  } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleTodo(id, { completed: !completed });
  };

  const handleDeleteButton = () => {
    deleteTodo(id);
  };

  const handleChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleTitleEdit = () => {
    setIsEditing(false);

    if (title === newTitle) {
      return;
    }

    if (!newTitle) {
      deleteTodo(id);

      return;
    }

    setLoadingTodos([id]);

    updateTodo(id, {
      ...todo,
      title: newTitle,
    })
      .then(() => {
        const newTodoList = todos.map(t => {
          return t.id === id
            ? { ...t, title: newTitle }
            : t;
        });

        setTodos(newTodoList);
      })
      .catch(() => setError('Unable to update todo'))
      .finally(() => setLoadingTodos([]));
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTitleEdit();
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChangeInput}
            onBlur={handleTitleEdit}
            onKeyUp={handleInputKeyUp}
            ref={inputRef}
          />
        </form>
      )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteButton}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
