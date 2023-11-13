import { useState } from 'react';
import cn from 'classnames';
import { Todo, TodoArgs } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo
  removeTodo: (todoId: number) => void
  loadingTodo: number[],
  editTodo: (todoId: number, payload: TodoArgs) => void
  setError: (error: string) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
  editTodo,
  setError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const { completed, title, id } = todo;

  const editTodoHandler = () => {
    editTodo(
      todo.id,
      { completed: !todo.completed },
    );
  };

  const handleDoubleClick = (
    event:React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setIsEditing(true);
  };

  const handlenewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalizeNewTodoTitle = event.target.value.trim();

    setNewTitle(normalizeNewTodoTitle);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsEditing(true);
      switch (newTitle) {
        case '':
          removeTodo(id);
          setError(Error.NoTitle);
          break;

        case todo.title:
          return;

        default:
          await editTodo(
            todo.id,
            { title: newTitle },
          );
      }
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyUp = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(newTitle);
    }
  };

  return (
    <div className={cn(
      'todo',
      { 'is-active': loadingTodo.includes(id) },
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={editTodoHandler}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={cn('todo__title-field', {
              'is-active': loadingTodo.includes(id),
            })}
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handlenewTitle}
            onBlur={handleBlur}
            onKeyUp={(event) => handleKeyUp(event)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
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
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': loadingTodo.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
