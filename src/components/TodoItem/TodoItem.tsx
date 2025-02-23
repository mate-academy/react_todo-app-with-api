import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { errorMessages, ErrorMessages } from '../../types/ErrorMessages';
import { TodoServiceAPI } from '../../service/todoServiceAPI';

type Props = {
  todo: Todo;
  isSubmiting?: boolean;
  onSetError: (errorMessage: ErrorMessages) => void;
  onHandleDeleteTodo?: (deleteTodoIds: number[]) => void;
  onUpdateTodoList?: (todoItem: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmiting,
  onSetError,
  onHandleDeleteTodo,
  onUpdateTodoList,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editTodoValue, setEditTodoValue] = useState(todo.title);
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingMode && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditingMode]);

  const handleTodoChecked = () => {
    setIsUpdating(true);
    TodoServiceAPI.toggleCompleteTodo(todo.id, !todo.completed)
      .then(onUpdateTodoList)
      .catch(() => onSetError(errorMessages.update))
      .finally(() => setIsUpdating(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsDeleting(true);

    TodoServiceAPI.deleteTodo(todoId)
      .then(() => {
        if (onHandleDeleteTodo) {
          onHandleDeleteTodo([todoId]);
        }
      })
      .catch(() => onSetError(errorMessages.delete))
      .finally(() => setIsDeleting(false));
  };

  const handleInvokeEditTodo = () => {
    setIsEditingMode(true);
  };

  const editTodo = () => {
    const normalizeTitle = editTodoValue.trim();

    if (!normalizeTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (normalizeTitle !== todo.title) {
      setIsUpdating(true);
      TodoServiceAPI.editTitle(todo.id, normalizeTitle)
        .then(onUpdateTodoList)
        .then(() => setIsEditingMode(false))
        .catch(() => onSetError(errorMessages.update))
        .finally(() => {
          setIsUpdating(false);
        });
    } else {
      setIsEditingMode(false);
    }
  };

  const handleSubmitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    editTodo();
  };

  const handleBlurTodo = () => {
    editTodo();
  };

  const handleEscapeEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingMode(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor="todoStatus">
        <input
          id="todoStatus"
          aria-label="Todo status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoChecked}
          checked={todo.completed}
        />
      </label>
      {isEditingMode ? (
        <form onSubmit={handleSubmitTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTodoValue}
            onBlur={handleBlurTodo}
            onChange={e => setEditTodoValue(e.target.value)}
            onKeyUp={handleEscapeEdit}
            ref={titleInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleInvokeEditTodo}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isDeleting || isSubmiting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
