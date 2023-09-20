import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  updateTodo: (v: Todo) => Promise<void>;
  isProcessed: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, updateTodo, isProcessed,
}) => {
  const [edited, setEdited] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [changeTodo, setChangeTodo] = useState(title);
  const [focus, setFocus] = useState(false);
  const thisTodo = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEdited(true);
    setFocus(true);
  };

  useEffect(() => {
    if (focus && thisTodo.current) {
      thisTodo.current.focus();
    }
  }, [focus]);

  const save = () => {
    setEdited(false);
    setFocus(false);

    if (changeTodo.trim().length === 0) {
      deleteTodo(todo.id);

      return;
    }

    if (changeTodo.trim() === title) {
      return;
    }

    updateTodo({ ...todo, title: changeTodo })
      .then(() => setTitle(changeTodo));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    save();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangeTodo(todo.title);
      setEdited(false);
      setFocus(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>

      {edited ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={thisTodo}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changeTodo}
            onChange={event => setChangeTodo(event.target.value)}
            onBlur={save}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
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

      <div className={classNames(
        'modal overlay',
        { 'is-active': isProcessed },
      )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
