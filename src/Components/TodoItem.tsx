import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  deleteTodo: (id: number) => void,
  isLoading: number[],
  updateTodo: (
    todo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void,
  changeErrorMessage: (message: string) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  updateTodo,
  changeErrorMessage,
}) => {
  const [isSelectedTodo, setIsSelectedTodo] = useState(false);
  const [edit, setEdit] = useState('');
  const [hasError, setHasError] = useState(false);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current && isSelectedTodo) {
      titleField.current.focus();
    }
  }, [isSelectedTodo]);

  const handleChangeComleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTodo = { ...todo, completed: event.target.checked };

    updateTodo(updatedTodo);
  };

  const handleStartEdit = () => {
    setIsSelectedTodo(true);
    setEdit(todo.title);
    setHasError(false);
  };

  const handleEditCancel = () => {
    setIsSelectedTodo(false);
    setEdit('');
    setHasError(true);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = edit.trim();

    if (trimmedTitle === todo.title) {
      if (hasError) {
        changeErrorMessage('Unable to update a todo');
        if (titleField.current) {
          titleField.current.focus();
        }
      } else {
        handleEditCancel();
      }
    } else if (trimmedTitle) {
      updateTodo(
        {
          ...todo,
          title: trimmedTitle,
        },
        () => {
          setHasError(false);
          handleEditCancel();
        },
        () => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setHasError(true);
          changeErrorMessage('Unable to update a todo');
        },
      );
    } else {
      deleteTodo(todo.id);
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
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeComleted}
        />
      </label>

      {isSelectedTodo ? (
        <form onSubmit={handleEdit} onBlur={handleEdit}>
          <input
            ref={titleField}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={edit}
            onChange={e => setEdit(e.target.value)}
            onBlur={handleEditCancel}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleStartEdit}
        >
          {todo.title}
        </span>

      )}

      {!isSelectedTodo && (
        <button
          type="button"
          className={classNames('todo__remove', {
            hidden: isSelectedTodo || isLoading,
          })}
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>

      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
