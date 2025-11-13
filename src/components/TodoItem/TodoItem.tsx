/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';
import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';
import { useState } from 'react';
import { USER_ID } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  editingTodo: Todo['id'] | null;
  isLoading: boolean;
  onCompletedChange: (todoId: Todo['id']) => void;
  onDelete: (todoId: Todo['id']) => void;
  onEditing: (todoId: Todo['id'] | null) => void;
  onEditingTodo: (todo: Todo) => void;
};

type EditingEvent =
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>;

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editingTodo,
  onCompletedChange,
  onDelete,
  onEditing,
  onEditingTodo,
  isLoading,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);

  const handleSubmitEditingForm = (event: EditingEvent) => {
    event.preventDefault();

    const trimmedUpdatedTitle = updatedTitle.trim();

    if (!trimmedUpdatedTitle) {
      onDelete(todo.id);

      return;
    }

    if (trimmedUpdatedTitle === todo.title) {
      onEditing(null);

      return;
    }

    const updatedTodo: Todo = {
      id: todo.id,
      userId: USER_ID,
      title: trimmedUpdatedTitle,
      completed: todo.completed,
    };

    onEditingTodo(updatedTodo);
  };

  const handleKeyUp = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (keyboardEvent.key === 'Escape') {
      onEditing(null);
    }

    return;
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCompletedChange(todo?.id)}
        />
      </label>

      {editingTodo === todo.id ? (
        <form onSubmit={handleSubmitEditingForm}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onKeyUp={handleKeyUp}
            value={updatedTitle}
            onBlur={handleSubmitEditingForm}
            onChange={inputEvent =>
              setUpdatedTitle(inputEvent.target.value.trimStart())
            }
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditing(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <Loader isLoading={isLoading} />
    </div>
  );
};
