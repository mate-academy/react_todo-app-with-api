import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const todosContext = useContext(TodosContext);
  const {
    updateTodo, deleteTodo, toggleTodo, isUpdating,
  } = todosContext;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEditing]);

  function handleEditCancel() {
    setIsEditing(false);
    setEditTitle('');
  }

  function handleDoubleClick() {
    setIsEditing(true);
    setEditTitle(title);
  }

  function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      handleEditCancel();

      return;
    }

    if (trimmedTitle) {
      updateTodo({
        ...todo,
        title: trimmedTitle,
      })
        .then(() => {
          handleEditCancel();
        })
        .catch(() => { });
    } else {
      deleteTodo(id);
    }
  }

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => toggleTodo(todo)}
          checked={completed}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            { title }
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleEdit}
          onBlur={handleEdit}
        >
          <input
            data-cy="TodoTitleField"
            ref={inputField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyUp={key => {
              if (key.code === 'Escape') {
                handleEditCancel();
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isUpdating.includes(id) || id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
