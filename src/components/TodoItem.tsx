import { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  tempoTodo: Todo | null;
  isLoading: boolean;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  toggleLoader: boolean;
  isEditing: boolean;
  setIsEditingTodoId: (todoId: number | null) => void;
};
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  tempoTodo,
  isLoading,
  updateTodo,
  toggleLoader,
  isEditing,
  setIsEditingTodoId,
}) => {
  const [localTodoLoader, setLocalTodoLoader] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleCheckedTodo = async () => {
    try {
      setLocalTodoLoader(true);

      const updatedTodo = { ...todo, completed: !todo.completed };

      await updateTodo(updatedTodo);
    } finally {
      setLocalTodoLoader(false);
    }
  };

  const handleSave = async () => {
    const trimmetTitle = editedTitle.trim();

    if (!trimmetTitle) {
      deleteTodo(todo.id);

      return;
    }

    if (trimmetTitle !== todo.title) {
      try {
        setLocalTodoLoader(true);
        const updatedTodo = { ...todo, title: trimmetTitle };

        await updateTodo(updatedTodo);

        setIsEditingTodoId(null);
      } catch (error) {
        setLocalTodoLoader(false);
        throw error;
      } finally {
        setLocalTodoLoader(false);
      }
    }

    setIsEditingTodoId(null);
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditingTodoId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheckedTodo}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            (tempoTodo && !todo.id) ||
            isLoading ||
            (toggleLoader && !todo.completed) ||
            localTodoLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
