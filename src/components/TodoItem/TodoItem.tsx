import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { useTodoContext } from '../../TodoContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const {
    deleteTodo,
    handleTodoUpdate,
    handleStatusChange,
    processingTodoIds,
  } = useTodoContext();
  const {
    id,
    title,
    completed,
  } = todo;

  const isProcessing = processingTodoIds.includes(id);

  const handleTodoDelete = () => {
    deleteTodo(id);
  };

  const handleStatusToggle = () => {
    setIsEditing(true);
    handleStatusChange(todo);
    setIsEditing(false);
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (trimmedTodoTitle === title) {
      setTodoTitle(trimmedTodoTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTodoTitle) {
      setTodoTitle(trimmedTodoTitle);
      await handleTodoUpdate(todo, trimmedTodoTitle);
    } else {
      handleTodoDelete();
    }

    setIsEditing(false);
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  const inputEdit = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputEdit.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusToggle}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={handleKeyUp}
              ref={inputEdit}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoDelete}
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal', 'overlay', {
            'is-active': isProcessing || id === 0,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
