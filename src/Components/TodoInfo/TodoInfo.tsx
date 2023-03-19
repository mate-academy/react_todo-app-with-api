import classNames from 'classnames';
import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isNewTodo: boolean;
  removeTodo?: (id: number) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTodo?: (todo: Todo) => Promise<void>;
  loadingTodo?: number[];
};

const TodoInfo: React.FC<Props> = ({
  todo,
  isNewTodo,
  removeTodo,
  updateTodo,
  loadingTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(todo.title);
  const [isEditTodo, setEditTodo] = useState(false);
  const [isDelTodo, setDelTodo] = useState(false);
  const [isUpdateTodo, setUpdateTodo] = useState(false);

  useEffect(() => {
    if (isEditTodo) {
      inputRef.current?.focus();
    }
  }, [isEditTodo]);

  const onRemove = () => {
    if (removeTodo) {
      setDelTodo(true);

      removeTodo(todo.id)
        .finally(() => setDelTodo(false));
    }
  };

  const onUpdateTodoStatus = () => {
    if (updateTodo) {
      setUpdateTodo(true);

      updateTodo({ ...todo, completed: !todo.completed })
        .finally(() => setUpdateTodo(false));
    }
  };

  const onUpdateTodoTitle = (e: FormEvent) => {
    e.preventDefault();

    if (value === todo.title) {
      setEditTodo(false);

      return;
    }

    if (!value.length) {
      setEditTodo(false);

      onRemove();

      return;
    }

    if (updateTodo) {
      setUpdateTodo(true);

      updateTodo({ ...todo, title: value })
        .finally(() => {
          setUpdateTodo(false);
          setEditTodo(false);
        });
    }
  };

  return (
    <li
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={onUpdateTodoStatus}
          readOnly
        />
      </label>

      {isEditTodo
        ? (
          <form onSubmit={onUpdateTodoTitle}>
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={onUpdateTodoTitle}
              onKeyUp={e => {
                if (e.key === 'Escape') {
                  onUpdateTodoTitle(e);
                }
              }}
            />
          </form>
        ) : (
          <span
            className="todo__title"
            onDoubleClick={() => setEditTodo(true)}
          >
            {value.length ? value : todo.title}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={onRemove}
      >
        ×
      </button>

      <div
        className={
          classNames(
            'modal',
            'overlay',
            {
              'is-active': isNewTodo || isDelTodo || isUpdateTodo
                || (loadingTodo?.includes(todo.id)),
            },
          )
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

export default TodoInfo;
