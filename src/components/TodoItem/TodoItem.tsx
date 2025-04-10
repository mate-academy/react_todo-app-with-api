/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, editTodo } from '../../api/todos';
import callError from '../../utils/callError';
import { MainContext } from '../../ContextProvider/ContextProvider';

type TodoProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoProps> = ({ todo }) => {
  const { todos, setTodos, setError, loadingIds } = useContext(MainContext);

  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedValue, setEditedValue] = useState(title);
  const [isLoading, setIsLoading] = useState(loadingIds.some(x => x === id));

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      setIsLoading(true);
      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter(task => task.id !== id));
        })
        .catch(() => callError(setError, 'delete'))
        .finally(() => setIsLoading(false));
    },
    [id, todos, setError, setTodos],
  );

  const handleCheckboxChange = () => {
    setIsLoading(true);
    editTodo(id, { completed: !completed })
      .then(() => {
        setTodos(
          todos.map(task =>
            task.id === id ? { ...task, completed: !completed } : task,
          ),
        );
      })
      .catch(() => callError(setError, 'update'))
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEdited(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedValue = editedValue.trim();

    if (trimmedValue === '') {
      handleDeleteClick(new MouseEvent('click') as unknown as React.MouseEvent);

      return;
    }

    if (trimmedValue === title) {
      setIsEdited(false);

      return;
    }

    setIsLoading(true);
    editTodo(id, { title: trimmedValue })
      .then(() => {
        setTodos(
          todos.map(task =>
            task.id === id ? { ...task, title: trimmedValue } : task,
          ),
        );
        setIsEdited(false);
      })
      .catch(() => callError(setError, 'update'))
      .finally(() => setIsLoading(false));
  };

  const handleBlur = () => {
    const trimmedValue = editedValue.trim();

    if (trimmedValue === '' && handleDeleteClick) {
      handleDeleteClick(new MouseEvent('click') as unknown as React.MouseEvent);
    } else if (trimmedValue !== title) {
      setIsLoading(true);
      editTodo(id, { title: trimmedValue })
        .then(() => {
          setTodos(
            todos.map(task =>
              task.id === id ? { ...task, title: trimmedValue } : task,
            ),
          );
        })
        .catch(() => callError(setError, 'update'))
        .finally(() => {
          setIsEdited(false);
          setIsLoading(false);
        });
    } else {
      setIsEdited(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEdited(false);
      setEditedValue(title);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteClick}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
