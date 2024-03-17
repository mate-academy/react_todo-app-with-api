import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, editTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  todos: Todo[];
  deletingId: number | null;
  deleteSingleTodo: (id: number) => void;
  setTempTodo: (todo: Todo | null) => void;
  focusInput: () => void;
  // errorMessage: string;
  setErrorMessage: (message: string) => void;
  setTodos: (todos: Todo[]) => void;
}
export default function TodoItem({
  todo,
  setTodos,
  focusInput,
  setTempTodo,
  todos,
  deletingId,
  deleteSingleTodo,
  // errorMessage,
  setErrorMessage,
}: Props) {
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const { id, title, completed } = todo;

  function updateTodo(): Promise<void> {
    setErrorMessage('');

    return editTodo({ id, userId: USER_ID, title: editedTitle, completed })
      .then(updatedTodo => {
        const newTodos = [...todos];
        const index = newTodos.findIndex(t => t.id === updatedTodo.id);

        if (updatedTodo.title.length === 0) {
          deleteSingleTodo(updatedTodo.id);
          focusInput();
        }

        newTodos.splice(index, 1, updatedTodo);
        setTodos(newTodos);
      })
      .catch(error => {
        setErrorMessage('Unable to edit a todo');
        throw error;
      })
      .finally(() => setEditing(false));
  }

  const handleDoubleClick = () => {
    setEditing(true);
  };

  return (
    <div>
      <div key={id}>
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed,
            editing,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>
          {editing ? (
            <form onBlur={updateTodo}>
              <input
                data-cy="TodoTitleField"
                type="text"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                className="todo__title-field edit "
                placeholder="Empty todo will be deleted"
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={handleDoubleClick}
              >
                {title.trim()}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteSingleTodo(id);
                }}
              >
                ×
              </button>
            </>
          )}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deletingId === id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </div>
    </div>
  );
}
