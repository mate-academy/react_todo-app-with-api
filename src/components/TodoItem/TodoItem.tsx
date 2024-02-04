import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo, TodoUpdate } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    userId,
    title,
    completed,
  },

  isTempTodo = false,
}) => {
  const { deleteTodo, updateTodo } = useContext(TodosContext);
  const [isLoading, setIsLoading] = useState(false);
  const [editField, setEditField] = useState(title);
  const editFieldElement = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      editFieldElement.current?.focus();
    } else if (!isEditing && title !== editField && updateTodo && deleteTodo) {
      const trimmedEditField = editField.trim();

      const todoPreparedToUpdate: TodoUpdate = {
        id,
        userId,
        title: trimmedEditField,
      };

      setIsLoading(true);

      if (trimmedEditField) {
        updateTodo(todoPreparedToUpdate)
          .catch(() => setIsEditing(true))
          .finally(() => setIsLoading(false));
      } else {
        deleteTodo(id).finally(() => setIsLoading(false));
      }
    }
  }, [isEditing]);

  const handleEditFieldKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        editFieldElement.current?.blur();
        break;
      case 'Escape':
        setEditField(title);
        setIsEditing(false);
        break;
      default:
        break;
    }
  };

  const loaderClasses = classNames(
    'modal',
    'overlay',
    { 'is-active': isTempTodo || isLoading },
  );

  const handleDeleteButton = () => {
    setIsLoading(true);

    if (deleteTodo) {
      deleteTodo(id)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleChangeStatusButton = () => {
    setIsLoading(true);

    const todoPreparedToUpdate: TodoUpdate = {
      id,
      userId,
      completed: !completed,
    };

    if (updateTodo) {
      updateTodo(todoPreparedToUpdate).finally(() => setIsLoading(false));
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleChangeStatusButton}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editField}
              ref={editFieldElement}
              onChange={(event) => setEditField(event.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyUp={handleEditFieldKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteButton}
            >
              ×
            </button>
          </>
        )}

      <div data-cy="TodoLoader" className={loaderClasses}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
