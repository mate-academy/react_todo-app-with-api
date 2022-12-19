import classNames from 'classnames';
import { useRef, useState, useEffect } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  onUpdate: (todo: Todo) => void,
  isLoading: boolean,
  title: string,
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    onUpdate = () => {},
    isLoading,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const editingField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField.current) {
      editingField.current.focus();
    }
  }, [isEditing]);

  function save() {
    setIsEditing(false);

    if (title === todo.title) {
      return;
    }

    if (title) {
      onUpdate({ ...todo, title });
    } else {
      onDelete(todo.id);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    save();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => {
            onUpdate({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={editingField}
            type="text"
            className="todo__title-field"
            defaultValue={todo.title}
            onChange={event => setTitle(event.target.value)}
            onBlur={save}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
