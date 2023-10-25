import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import classNames from 'classnames';

import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  const { completed, title, id } = todo;
  const {
    deleteTodo,
    toggleTodo,
    updateTodo,
    isLoadingTodo,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEditing]);

  const handlerDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handlerEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
  };

  const handlerEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTitle = editTitle.trim();

    if (newTitle === title) {
      handlerEditCancel();

      return;
    }

    if (newTitle) {
      updateTodo({
        ...todo,
        title: newTitle,
      })
        .then(() => {
          handlerEditCancel();
        })
        .catch(() => {});
    } else {
      deleteTodo(id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      handlerEditCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
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
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handlerDoubleClick}
          >
            {title}
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
      ) : (
        <form onSubmit={handlerEditSubmit} onBlur={handlerEditSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={inputField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoadingTodo.includes(id) || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
