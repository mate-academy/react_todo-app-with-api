import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleCompletedStatus: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  handleFormSubmitEdited: (
    editTodo: Todo,
    editTitle: string,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void;
  isLoadingArr: number[];
  setEditTodo: (todo: Todo | null) => void;
  editTodo: Todo | null;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleCompletedStatus,
  handleDelete,
  handleFormSubmitEdited,
  isLoadingArr,
  setEditTodo,
  editTodo,
}) => {
  const [editTitle, setEditTitle] = useState<string>('');
  const inputEdit = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputEdit.current) {
      inputEdit.current?.focus();
    }
  }, [editTodo]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditTodo(null);
        setEditTitle('');
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleDoubleClick = (chosenTodo: Todo) => {
    setEditTodo(chosenTodo);
    setEditTitle(chosenTodo.title);
  };

  const handleEditTodo: React.ChangeEventHandler<HTMLInputElement>
  = (event) => {
    setEditTitle(event.target.value);
  };

  const handleBlur = () => {
    if (editTodo) {
      handleFormSubmitEdited(
        editTodo, editTitle,
      );
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
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
          onChange={() => handleCompletedStatus(todo)}
        />
      </label>

      {editTodo?.id === todo.id
        ? (
          <form
            onSubmit={(event) => {
              handleFormSubmitEdited(
                editTodo, editTitle, event,
              );
            }}

          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={
                (event) => handleEditTodo(event)
              }
              ref={inputEdit}
              onBlur={() => {
                if (inputEdit) {
                  handleBlur();
                }
              }}
              disabled={isLoadingArr.includes(todo.id)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                handleDoubleClick(todo);
              }}
            >
              {editTitle || todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoadingArr.includes(todo.id),
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
