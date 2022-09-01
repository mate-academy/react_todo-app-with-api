import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (v: number) => void;
  setTodos: (v: Todo[]) => void;
  changeStatusTodo: (v: number, v2: boolean) => void;
  selectedId: number;
  setSelectedId: (v: number) => void;
  title: string;
  setTitle: (v: string) => void;
  changeTitleTodo: () => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  (props) => {
    const {
      todo,
      removeTodo,
      changeStatusTodo,
      selectedId,
      setSelectedId,
      title,
      setTitle,
      changeTitleTodo,
    } = props;
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, [selectedId]);

    return (
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => changeStatusTodo(todo.id, todo.completed)}
          />
        </label>

        {todo.id === selectedId
          ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              changeTitleTodo();
            }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                ref={titleField}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => changeTitleTodo()}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setSelectedId(0);
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
                  setTitle(todo.title);
                  setSelectedId(todo.id);
                }}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => removeTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

        <div
          data-cy="TodoLoader"
          className={todo.isLoading
            ? 'modal overlay is-active'
            : 'modal overlay'}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
