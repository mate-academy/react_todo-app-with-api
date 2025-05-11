/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todo: Todo;
  tempTodo: Todo | null;
  //creatingTodo: boolean;
  onDelete: (id: number) => void;
  isTodoLoading: boolean;
  isTodoDeleting: boolean;
  isProcessed: boolean;
  toggleTodoStatus: (id: number, completed: boolean) => void;
  editTodo: (todoId: number, newTitle: string) => void;
  setErrorMessage: (error: ErrorMessage) => void;
  loadingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    //tempTodo,
    //creatingTodo,
    onDelete,
    isTodoLoading,
    isTodoDeleting,
    isProcessed,
    toggleTodoStatus,
    editTodo,
    setErrorMessage,
    loadingTodoId,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleBlur = async () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    setIsUpdating(true);
    if (trimmedTitle === '') {
      try {
        //setLocalLoadingTodoId(todo.id);
        onDelete(todo.id);
        await deleteTodo(todo.id);
      } catch (error) {
        setErrorMessage(ErrorMessage.UnableToDelete);
      } finally {
        //setLocalLoadingTodoId(null);
      }
    } else if (trimmedTitle !== todo.title) {
      try {
        //setLocalLoadingTodoId(todo.id);
        await updateTodo(todo.id, { title: trimmedTitle });
        editTodo(todo.id, trimmedTitle);
        setIsEditing(false);
      } catch (error) {
        setErrorMessage(ErrorMessage.UnableToUpdate);
      } finally {
        //setLocalLoadingTodoId(null);
      }
    } else {
      setIsEditing(false);
    }

    setIsUpdating(false);
  };

  const handleKeyboardDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={event => setEditedTitle(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyboardDown}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isTodoLoading || isProcessed || isTodoDeleting}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 || isProcessed || isUpdating || loadingTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
