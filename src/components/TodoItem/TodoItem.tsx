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
  // Если isEditing становится false,
  // то фокус не будет устанавливаться

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    // setEditTitle('') - не изменяет значение editTitle,
    // если не были внесены изменения в текстовое поле ввода
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTitle = editTitle.trim();

    if (newTitle === title) {
      handleEditCancel();

      return;
    }

    if (newTitle) {
      updateTodo({
        ...todo,
        title: newTitle,
      })
        .then(() => {
          handleEditCancel();
        })
        .catch(() => {});
    } else {
      deleteTodo(id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      handleEditCancel();
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
            onDoubleClick={handleDoubleClick}
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
        <form onSubmit={handleEditSubmit} onBlur={handleEditSubmit}>
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
