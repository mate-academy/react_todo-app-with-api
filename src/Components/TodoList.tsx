/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  loadingTodoId: number | null;
  onToggleTodoStatus: (todo: Todo) => void;
  editedTodo: Todo | null;
  onTodoTitleUpdateSubmit: (title: string) => void;
  onTodoEditing: (todo: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loadingTodoId,
  onToggleTodoStatus,
  editedTodo,
  onTodoTitleUpdateSubmit,
  onTodoEditing,
}) => {
  const [editedTodoTitle, setEditedTodoTitle] = useState<string>(
    editedTodo?.title || '',
  );

  const editedTodoRef = useRef<HTMLInputElement>(null);

  function handleTodoTitleEdit(event: React.ChangeEvent<HTMLInputElement>) {
    setEditedTodoTitle(event.target.value);
  }

  function handleTodoTitleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onTodoTitleUpdateSubmit(editedTodoTitle);
  }

  useEffect(() => {
    if (editedTodo && editedTodoRef.current) {
      editedTodoRef.current.focus();
    }
  }, [editedTodo]);

  return (
    <>
      {todos.map((todo: Todo) => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggleTodoStatus(todo)}
            />
          </label>

          {editedTodo?.id !== todo.id && (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  onTodoEditing(todo);
                  setEditedTodoTitle(todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          {editedTodo?.id === todo.id && (
            <form onSubmit={handleTodoTitleSubmit}>
              <input
                ref={editedTodoRef}
                type="text"
                data-cy="TodoTitleField"
                onChange={handleTodoTitleEdit}
                onBlur={() => {
                  onTodoTitleUpdateSubmit(editedTodoTitle);
                  onTodoEditing(null);
                }}
                onKeyUp={event => {
                  if (event.key === 'Escape') {
                    onTodoEditing(null);
                  }
                }}
                value={editedTodoTitle}
              />
            </form>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': loadingTodoId === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};
