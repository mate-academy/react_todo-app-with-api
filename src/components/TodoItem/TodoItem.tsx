import classNames from 'classnames';
import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  improveTodo: (id: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number;
  toggleLoader: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  improveTodo,
  isLoading,
  selectedId,
  toggleLoader,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const newTodoField = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const handleTitleChange = (event: FormEvent) => {
    event.preventDefault();
    setDoubleClick(false);

    if (!updatedTitle.trim().length) {
      removeTodo(id);
    }

    improveTodo(id, { title: updatedTitle });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => {
            improveTodo(id, { completed: !completed });
          }}
        />
      </label>

      {
        doubleClick
          ? (
            <form onSubmit={handleTitleChange}>
              <input
                data-cy="TodoTitleField"
                value={updatedTitle}
                type="text"
                ref={newTodoField}
                placeholder="Empty todo will be deleted"
                className="todo__title-field"
                onChange={event => setUpdatedTitle(event.target.value)}
                onBlur={handleTitleChange}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setDoubleClick(false);
                  }
                }}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setDoubleClick(true);
                  setUpdatedTitle(title);
                }}
                onBlur={() => setDoubleClick(false)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => {
                  removeTodo(id);
                }}
              >
                ×
              </button>

              {
                selectedId === id && (
                  <div
                    data-cy="TodoLoader"
                    className={classNames(
                      'modal overlay',
                      { 'is-active': isLoading },
                    )}
                  >
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                )
              }

            </>
          )
      }

      {
        toggleLoader && (
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isLoading },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};
