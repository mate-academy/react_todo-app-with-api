import {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  handleUpdateTodo: (id: number, data:Partial<Todo>) => void;
  isAdding: boolean;
  selectedId: number;
  toggleLoader: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  handleUpdateTodo,
  isAdding,
  selectedId,
  toggleLoader,
}) => {
  const newTodo = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    if (newTodo.current) {
      newTodo.current.focus();
    }
  }, [doubleClick]);

  const handleChangeTitle = (event: FormEvent) => {
    event.preventDefault();
    setDoubleClick(false);

    if (!newTitle.trim().length) {
      removeTodo(todo.id);
    }

    handleUpdateTodo(todo.id, { title: newTitle });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleUpdateTodo(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {doubleClick ? (
        <form onSubmit={handleChangeTitle}>
          <input
            data-cy="TodoTitleField"
            value={newTitle}
            type="text"
            ref={newTodo}
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleChangeTitle}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDoubleClick(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setDoubleClick(true);
              setNewTitle(todo.title);
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
              removeTodo(todo.id);
            }}
          >
            ×
          </button>

          {selectedId === todo.id && (
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isAdding,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </>
      )}

      {toggleLoader && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isAdding })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
