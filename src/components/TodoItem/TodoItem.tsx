import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodos, updateTodoOnServer } from '../../api/todos';
import { ChangeFunction } from '../../types/ChangeFunction';
import { EditedTodo } from '../EditedTodo';
import { NoEditedTodo } from '../NoEditedTodo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  handleDelete: (todoId: number) => void;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  ChangeTodo: ChangeFunction;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  handleDelete = () => {},
  showError = () => {},
  hideError = () => {},
  ChangeTodo = () => {},
}) => {
  const { title, completed, id } = todo;

  const [isEdited, setIsEdit] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const editFormRef = useRef<HTMLInputElement | null>(null);

  const handleDeleteTodo = async (onError?: () => void) => {
    hideError();
    setIsWaiting(true);

    try {
      await deleteTodos(id);
      handleDelete(id);
    } catch {
      showError(ErrorMessage.Delete);
      setIsWaiting(false);

      onError?.();
    }
  };

  const handleChangeTodo: ChangeFunction = async (
    todoId,
    propName,
    newPropValue,
    onError,
  ) => {
    hideError();
    setIsWaiting(true);

    try {
      await updateTodoOnServer(todoId, { [propName]: newPropValue });

      ChangeTodo(todoId, propName, newPropValue);
    } catch {
      showError(ErrorMessage.Update);

      onError?.();
    } finally {
      setIsWaiting(false);
    }
  };

  const handleStatusChange = () => {
    handleChangeTodo(id, 'completed', !completed);
  };

  const handleTitleChange = () => {
    const newTitle = editedTitle.trim();

    setIsEdit(false);
    setEditedTitle(newTitle);

    if (newTitle === title) {
      return;
    }

    const onError = () => {
      setEditedTitle(title);
    };

    if (!newTitle) {
      handleDeleteTodo(onError);

      return;
    }

    handleChangeTodo(id, 'title', newTitle, onError);
  };

  const cancelTitleChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Escape') {
      return;
    }

    setIsEdit(false);
    setEditedTitle(title);
  };

  useEffect(() => {
    if (editFormRef.current && isEdited) {
      editFormRef.current.focus();
    }
  }, [isEdited]);

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEdited
        ? (
          <EditedTodo
            handleTitleChange={handleTitleChange}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            cancelTitleChange={cancelTitleChange}
            editFormRef={editFormRef}
          />
        )
        : (
          <NoEditedTodo
            setIsEdit={setIsEdit}
            title={title}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

      <div
        className={cn('modal overlay', {
          'is-active': isLoading || isWaiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
