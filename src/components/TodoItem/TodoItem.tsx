import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ERROR_MESSAGES, ErrorMessage } from '../../types/ErrorMessages';
import { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  processingIds: number[];
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  focusInput?: () => void;
  isEditing?: boolean;
  onStartEditing?: (id: number) => void;
  onCancelEditing?: () => void;
};

export const TodoItem = ({
  todo,
  setProcessingIds,
  processingIds,
  setTodos,
  setErrorMessage,
  focusInput,
  isEditing,
  onStartEditing,
  onCancelEditing,
}: TodoItemProps) => {
  const [editedTitle, setEditedTitle] = useState('');
  const isProcessing = processingIds.includes(todo.id);

  const handleDeleteButton = (id: number): void => {
    if (processingIds.includes(id)) {
      return;
    }

    setProcessingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        setTodos?.(prevTodos => prevTodos.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage?.(ERROR_MESSAGES.DELETE_FAIL);
      })
      .finally(() => {
        setProcessingIds(prevState =>
          prevState.filter(todoId => todoId !== id),
        );
        focusInput?.();
      });
  };

  const handleCheckboxButton = (id: number, completed: boolean) => {
    if (processingIds.includes(id)) {
      return;
    }

    setProcessingIds(prevState => [...prevState, id]);

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        setTodos?.(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage?.(ERROR_MESSAGES.UPDATE_FAIL);
      })
      .finally(() => {
        setProcessingIds(prevState =>
          prevState.filter(todoId => todoId !== id),
        );
      });
  };

  const onSaveEditing = (id: number, title: string) => {
    if (isProcessing) {
      return;
    }

    setProcessingIds(prevState => [...prevState, id]);
    updateTodo(id, { title })
      .then(() => {
        setTodos?.(prevTodos =>
          prevTodos.map(t => (t.id === id ? { ...t, title } : t)),
        );
        onCancelEditing?.();
      })
      .catch(() => {
        setErrorMessage?.(ERROR_MESSAGES.UPDATE_FAIL);
      })
      .finally(() => {
        setProcessingIds(prevState =>
          prevState.filter(todoId => todoId !== id),
        );
      });
  };

  const commitEdit = () => {
    if (isProcessing) {
      return;
    }

    const normalizedTitle = editedTitle.trim();

    if (normalizedTitle === todo.title) {
      onCancelEditing?.();

      return;
    }

    if (!normalizedTitle) {
      handleDeleteButton(todo.id);

      return;
    }

    onSaveEditing(todo.id, normalizedTitle);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleCheckboxButton(todo.id, todo.completed);
          }}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onStartEditing?.(todo.id);
              setEditedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteButton(todo.id);
            }}
            disabled={isProcessing}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            commitEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            autoFocus
            onKeyUp={e => {
              if (e.key === 'Escape') {
                onCancelEditing?.();

                return;
              }
            }}
            onBlur={commitEdit}
          />
        </form>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
