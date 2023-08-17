import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todosIdInLoading?: number[];
  changeTodo?: (todo: Todo) => void;
  deleteTodo?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosIdInLoading = [0],
  changeTodo = () => { },
  deleteTodo = () => { },
}) => {
  const { id, title, completed } = todo;
  const [loading, setLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todosIdInLoading.includes(id)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [todosIdInLoading]);

  useEffect(() => {
    if (titleField.current && editingTodo) {
      titleField.current.focus();
    }
  }, [editingTodo]);

  const handleChange = () => {
    changeTodo({
      ...todo,
      completed: !completed,
    });
  };

  const handleSubmit = () => {
    const newTitle = editTitle.trim();

    if (!newTitle) {
      deleteTodo(id);
    }

    if (newTitle && newTitle !== title) {
      changeTodo({
        ...todo,
        title: newTitle,
      });
      setEditTitle(newTitle);
    }

    setEditingTodo(false);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setEditingTodo(false);
    }

    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleChange}
        />
      </label>

      {!editingTodo && (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditingTodo(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {editingTodo && (
        <form>
          <input
            type="text"
            ref={titleField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleOnKeyDown}
          />
        </form>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': loading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="Loader">
          <div className="Loader__content" />
        </div>
      </div>
    </div>
  );
};
