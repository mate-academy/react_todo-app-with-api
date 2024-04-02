import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../context/TodosContext';
import { TodoId } from '../../types/TodoId';
import { useEffect, useRef, useState } from 'react';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const {
    currentId,
    handleToggleTodoCheck,
    handleDeletingTodo,
    handleUpdateTodo,
    handleSetError,
    dispatch,
  } = useTodos();

  const isTemptTodo = (todoIdValue: TodoId) => todoIdValue === 0;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const isEditingOrDeleting = async (event: React.FormEvent) => {
    event.preventDefault();
    if (todo.title === editValue.trim()) {
      setIsEditing(false);

      return;
    }

    if (editValue) {
      dispatch({ type: 'todos/setCurrentId', payload: todo.id });
      setIsEditing(true);
      try {
        await updateTodo(todo.id, { ...todo, title: editValue.trim() });

        handleUpdateTodo(todo.id, { ...todo, title: editValue.trim() });
        setIsEditing(false);
      } catch {
        handleSetError('Unable to update a todo');
      } finally {
        dispatch({ type: 'todos/setCurrentId', payload: null });
      }
    } else {
      handleDeletingTodo(todo.id);
    }
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const isItemLoading = currentId.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={cn('todo ', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="Check todo">
        <input
          onChange={() => handleToggleTodoCheck(todo.id, todo, !todo.completed)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={isEditingOrDeleting}>
          <input
            ref={editInputRef}
            value={editValue}
            onBlur={isEditingOrDeleting}
            onKeyUp={cancelEditing}
            onChange={event => setEditValue(event.target.value)}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
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
            onClick={() => handleDeletingTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isItemLoading || isTemptTodo(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
