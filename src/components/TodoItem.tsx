import classNames from 'classnames';
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { Todo } from '../types/Todo';
import { patchTodo } from '../api/todos';
import { TodoContext } from '../utils/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    onDelete,
    updateTodo,
    removeLoadingTodo,
    addLoadingTodo,
    loadingTodos,
    deletingTodoId,
    isLoading,
    updateTodoOnServer,
  } = useContext(TodoContext);

  const { id, title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      onDelete(id);
      setIsEditing(false);

      return;
    }

    if (newTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    updateTodoOnServer(id, { title: newTitle });
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleTodoCheck = async () => {
    try {
      addLoadingTodo(todo.id);
      const updatedTodo = { ...todo, completed: !todo.completed };

      await patchTodo(todo.id, updatedTodo);
      updateTodo(updatedTodo);
    } finally {
      removeLoadingTodo(todo.id);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <section className="todoapp__main">
      <div
        onDoubleClick={() => setIsEditing(true)}
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={handleTodoCheck}
            checked={completed}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleTitleChange}>
            <input
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={() => handleTitleChange()}
              onKeyUp={handleKeyUp}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{ title }</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

        <div className={classNames(
          'modal overlay',
          {
            'is-active': loadingTodos.includes(todo.id)
              || deletingTodoId === todo.id
              || isLoading,
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
