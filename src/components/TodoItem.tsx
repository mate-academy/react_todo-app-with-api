/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import TodoLoader from './TodoLoader';
import { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Errors } from '../types/Error';

type TodoItemProps = {
  todo: Todo;
  isPending?: boolean;
  onError: (message: Errors) => void;
  onDelete: (id: number) => void;
  onUpdateTodo: (data: Todo) => void;
  onSetLoading: (ids: number[]) => void;
};
function TodoItem({
  todo,
  isPending = false,
  onError,
  onDelete,
  onUpdateTodo,
  onSetLoading,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  function handleDoubleClick() {
    setIsEditing(true);
  }

  async function handleDelete() {
    onSetLoading([todo.id]);
    try {
      const { id } = todo;

      await deleteTodo(id);
      onDelete(id);
    } catch (error) {
      onError(Errors.DeleteTodo);
    } finally {
      onSetLoading([]);
    }
  }

  async function handleUpdateTitle(id: number, newTitle: string) {
    const preparedTitle = newTitle.trim();
    if (newTitle === todo.title) {
      setIsEditing(false);
      return;
    }
    if (!preparedTitle) {
      await handleDelete();
    } else {
      try {
        onSetLoading([todo.id]);

        const editedTodo = await updateTodo(id, { title: preparedTitle });

        onUpdateTodo(editedTodo);
        setIsEditing(false);
      } catch (error) {
        onError(Errors.UpdateTodo);
      } finally {
        onSetLoading([]);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get('title') as string;
    const { id } = todo;
    await handleUpdateTitle(id, newTitle);
  }

  async function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    const { id } = todo;
    await handleUpdateTitle(id, newTitle);
  }

  async function handleToggle(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;

    try {
      onSetLoading([todo.id]);
      const { id } = todo;
      const editedTodo = await updateTodo(id, { completed: checked });

      onUpdateTodo(editedTodo);
    } catch (error) {
      onError(Errors.UpdateTodo);
    } finally {
      onSetLoading([]);
    }
  }
  function handleCancelEditing(e: React.KeyboardEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.key === 'Escape') {
      setIsEditing(false);
      return;
    }
  }
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
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} onKeyUp={handleCancelEditing}>
          <input
            type="text"
            className="todo__title-field"
            name="title"
            defaultValue={todo.title}
            onBlur={handleBlur}
            data-cy="TodoTitleField"
            autoFocus
          />
        </form>
      )}

      <TodoLoader isLoading={isPending} />
    </div>
  );
}

export default TodoItem;
