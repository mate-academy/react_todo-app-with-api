import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo,
  onDeleteTodo?: () => void,
  onTodoUpdate?: (todoTitle: string) => Promise<void>,
  isProcessing: boolean,
  updateTodoStatus?: (todo: Todo) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => { },
  isProcessing,
  onTodoUpdate = () => { },
  updateTodoStatus = () => { },
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await onTodoUpdate(todoTitle);
    } else {
      await onDeleteTodo();
    }

    setIsEditing(false);
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleRemoveUpdateChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodoStatus(todo)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTodoSave} onBlur={handleTodoSave}>
            <input
              ref={titleInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitle}
              onKeyUp={handleRemoveUpdateChange}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todoTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDeleteTodo();
              }}
            >
              ×
            </button>
          </>
        )}

      <Loader isProcessing={isProcessing} todoId={id} />
    </div>
  );
};
