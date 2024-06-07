/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  Dispatch,
  FormEvent,
  useEffect,
  SetStateAction,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import * as todoMethods from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todo: Todo;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | string>>;
  isTempt?: boolean;
  toggleTodo: (todoToUpdate: Todo) => void;
  renameTodo: (editedTitle: string, todoToRename: Todo) => void;
  loadingId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  setErrorMessage,
  isTempt,
  toggleTodo,
  renameTodo,
  loadingId,
  setTodos,
  todos,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => setIsEditing(false), [todo]);

  const deleteTodo = (todoId: number) => {
    setIsDeleting(true);
    todoMethods
      .deleteTodo(todoId)
      .then(() => {
        setTodos([...todos.filter(item => item.id !== todo.id)]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleSubmit = (event: FormEvent) => {
    event?.preventDefault();

    if (editedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    renameTodo(editedTitle, todo);
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
          onClick={() => toggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsEditing(false);
              setEditedTitle(todo.title);
            }
          }}
        >
          <input
            // ref={renameRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            autoFocus
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
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            isTempt || isDeleting || loadingId.some(id => id === todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
