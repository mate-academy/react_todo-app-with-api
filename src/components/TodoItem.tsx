/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { updateCompletedTodo } from '../api/todos';
import { ErrorText } from '../utils/ErrorText';

type Props = {
  todo: Todo;
  handleUpdateTodo: (id: number, currentStatus: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  isLoading: boolean;
  isCompletedTodo: number[];
  setErrorMessage: (value: string) => void;
  setArrayById: (id: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleUpdateTodo,
  handleDeleteTodo,
  isLoading,
  isCompletedTodo,
  setErrorMessage,
  setArrayById,
}) => {
  const [editTitle, setEditTitle] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const updateText = (id: number, todoTitle: string) => {
    const normalizeText = (value: string) => {
      return value
        .trim()
        .split(' ')
        .filter(symbol => symbol !== '')
        .join(' ');
    };

    if (normalizeText(todo.title) === normalizeText(todoTitle)) {
      setIsEditing(false);

      return;
    }

    if (normalizeText(todoTitle) === '') {
      handleDeleteTodo(id);

      return;
    }

    setIsEditLoading(true);

    updateCompletedTodo({
      id,
      completed: todo.completed,
      userId: todo.userId,
      title: normalizeText(todoTitle),
    })
      .then(() => {
        setArrayById(id, normalizeText(todoTitle));
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(ErrorText.TodoUpdate);
      })
      .finally(() => setIsEditLoading(false));
  };

  const preventFormClose = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preventFormClose.current && isEditing) {
      preventFormClose.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', todo.completed && 'completed')}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => {
            handleUpdateTodo(todo.id, todo.completed);
          }}
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <input
          ref={preventFormClose}
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={() => updateText(todo.id, editTitle)}
          data-cy="TodoTitleField"
          onKeyUp={event => {
            event.preventDefault();
            if (event.key === 'Enter') {
              updateText(todo.id, editTitle);
            } else if (event.key === 'Escape') {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isLoading && isCompletedTodo.includes(todo.id)) || isEditLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
