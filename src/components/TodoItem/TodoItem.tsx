import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { GlobalContext } from '../../providers';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingTodos,
    handleDelete,
    handleEditTodo,
  } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(todo.title);
  const focusForm = useRef<HTMLInputElement | null>(null);

  const deleteButton = () => {
    handleDelete(todo);
  };

  const handleStatusChange = (event: FormEvent) => {
    event.preventDefault();

    handleEditTodo({ ...todo, completed: !todo.completed });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    switch (true) {
      case (!titleValue.trim()):
        handleDelete(todo);
        setIsEditing(false);
        break;
      case (titleValue.trim() !== todo.title):
        setIsEditing(false);
        handleEditTodo({ ...todo, title: titleValue.trim() }, setIsEditing);
        break;
      case (titleValue.trim() === todo.title):
      default:
        (setIsEditing(false));
        break;
    }
  };

  useEffect(() => {
    if (loadingTodos.find(target => target.id === todo.id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodos, todo.id]);

  useEffect(() => {
    if (isEditing && focusForm.current) {
      focusForm.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={focusForm}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleValue}
              onChange={(event) => setTitleValue(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                  setTitleValue(todo.title);
                }
              }}
              onBlur={handleSubmit}
            />
          </form>
        )
        : (
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
              data-cy="TodoDelete"
              onClick={deleteButton}
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
            'is-active': isLoading || todo.id === 0,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
