import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../Context/TodoContext';
import { CurrentError } from '../types/CurrentError';

type Props = {
  todo: Todo,
};

export const TodoElement: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const {
    handleTodoDelete,
    processingTodoIds,
    handleTodoRename,
    setError,
    handleToggleChange,
  } = useContext(TodoContext);

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);
  const shouldDisplayLoader = id === 0 || processingTodoIds.includes(id);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      if (todoTitle) {
        await handleTodoRename(todo, todoTitle);
      } else {
        await handleTodoDelete(id);
      }

      setIsEditing(false);
    } catch (error) {
      titleInputRef.current?.focus();

      if (error === CurrentError.UpdateError) {
        setError(CurrentError.UpdateError);
        throw new Error();
      }

      if (error === CurrentError.DeleteError) {
        setError(CurrentError.DeleteError);
        throw new Error();
      }

      if (error === CurrentError.EmptyTitleError) {
        setError(CurrentError.EmptyTitleError);
        throw new Error();
      }
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            handleToggleChange(todo);
          }}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoChange}
            onBlur={handleTodoChange}
          >
            <input
              ref={titleInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={(event) => {
                handleOnKeyUp(event);
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
              onBlur={() => {
                setIsEditing(false);
              }}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleTodoDelete(id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': shouldDisplayLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
