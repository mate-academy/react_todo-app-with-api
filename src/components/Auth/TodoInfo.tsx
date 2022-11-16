import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  deleteTodo?: (todoId: number) => void;
  updateTodo?: (todoId: number, data: Partial<Todo>) => void;
  isUpdating?: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  deleteTodo,
  isDeleting,
  updateTodo,
  isUpdating,
}) => {
  const inputField = useRef<HTMLInputElement>(null);
  const { completed, id, title } = todo;
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleteTodoClick = () => {
    if (deleteTodo) {
      deleteTodo(id);
    }
  };

  const handleUpdateTodo = (data: Partial<Todo>) => {
    if (updateTodo) {
      updateTodo(id, data);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTitle(value);
  };

  const handleTodoChange = () => {
    setIsRenaming(false);

    if (!newTitle && deleteTodo) {
      deleteTodo(id);
    }

    if (newTitle && newTitle !== title) {
      handleUpdateTodo({ title: newTitle });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTodoChange();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsRenaming(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isRenaming]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed })}
      onDoubleClick={() => {
        setIsRenaming(true);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            handleUpdateTodo({ completed: !completed });
          }}
        />
      </label>

      {isRenaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleTodoChange}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            ref={inputField}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDeleteTodoClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isAdding || isDeleting || isUpdating,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
