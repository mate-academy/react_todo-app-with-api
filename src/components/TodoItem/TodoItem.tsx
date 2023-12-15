/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AppContext } from '../../AppContext';

interface Props {
  todo: Todo;
  removeTodo: (todo: Todo) => Promise<void>;
  isLoading?: boolean;
  updateTodo: (todo: Todo) => Promise<void>;
}

export const TodoItem = ({
  todo,
  removeTodo,
  isLoading,
  updateTodo,
}: Props) => {
  const { state } = useContext(AppContext);

  const [loaderStatus, setLoaderStatus] = useState(isLoading);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  const handleCheckboxClick = () => {
    setLoaderStatus(true);
    updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .finally(() => setLoaderStatus(false));
  };

  const handleDeleteTodo = () => {
    setLoaderStatus(true);
    removeTodo(todo)
      .then(() => {
        setIsEditing(false);
        setLoaderStatus(false);
      });
  };

  const handleTitleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (event.detail >= 2) {
      setIsEditing(true);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(todo.title);
    }
  };

  const handleInputSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (editingTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const editedTodo: Todo = {
      ...todo,
      title: editingTitle.trim(),
    };

    if (editedTodo.title === '') {
      handleDeleteTodo();

      return;
    }

    setLoaderStatus(true);
    updateTodo(editedTodo)
      .finally(() => {
        setIsEditing(false);
        setLoaderStatus(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxClick}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleInputSubmit} ref={formRef}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            onBlur={() => handleInputSubmit()}
            onKeyUp={handleInputKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={handleTitleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo()}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': loaderStatus || state.globalLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
