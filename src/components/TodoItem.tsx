import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  selectedId: number;
  title: string;

  setTodos: (value: Todo[]) => void;
  setSelectedId: (value: number) => void;
  setTitle: (value: string) => void;

  editTodoStatus: (value: number, value2: boolean) => void;
  editTodoTitle: () => void;

  deleteTodo: (value: number) => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  (props) => {
    const {
      todo,
      selectedId,
      title,
      setSelectedId,
      setTitle,
      editTodoStatus,
      editTodoTitle,
      deleteTodo,
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
            onClick={() => editTodoStatus(todo.id, todo.completed)}
          />
        </label>

        {todo.id === selectedId
          ? (
            <form onSubmit={(event) => {
              event.preventDefault();
              editTodoTitle();
            }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                ref={titleField}
                value={title}
                onBlur={() => editTodoTitle()}
                onChange={event => setTitle(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Escape') {
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
                onClick={() => deleteTodo(todo.id)}
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
