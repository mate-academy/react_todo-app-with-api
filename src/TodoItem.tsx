import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { editTodos } from './api/todos';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  todos,
  updateTodos,
  setError,
  handleDelete,
  tempTodo,
  isDeleting,
  handleStatus,
  updatingStatusIds,
  clearingCompletedIds,
}) => {
  const [editingId, setEditingId] = useState<null | number>(null);
  const [editingVal, setEditingVal] = useState('');
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  const ref = useRef<HTMLInputElement | null>(null);

  const handleDouble = (todoId: number, todoTitle: string) => {
    setEditingId(todoId);
    setEditingVal(todoTitle);
  };

  const handleSubmit = async (todoId: number) => {
    if (isUpdatingTitle) {
      return;
    }

    if (editingVal.trim() === '') {
      handleDelete(todoId);

      return;
    }

    if (editingVal.trim() === title) {
      setEditingId(null);

      return;
    }

    const todoToUpdate = todos.find(todo => todo.id === todoId);
    const updatedTodo = {
      title: editingVal,
      todoId: todoToUpdate.id,
      completed: completed,
    };

    setIsUpdatingTitle(true);

    try {
      await editTodos(updatedTodo);
      updateTodos(todoId, editingVal.trim());
      setEditingId(null);
      setIsUpdatingTitle(true);
    } catch (error) {
      setError('Unable to update a todo');
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const handleBlur = (todoId: number) => {
    if (!isUpdatingTitle) {
      handleSubmit(todoId);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(todoId);
    } else if (event.key === 'Escape') {
      setEditingId(null);
      setEditingVal(title);
    }
  };

  useEffect(() => {
    if (editingId !== null && ref.current) {
      (ref.current as HTMLInputElement).focus();
    }
  }, [editingId]);

  if (tempTodo && tempTodo.id === id) {
    return (
      <div data-cy="Todo" className="todo">
        <label htmlFor={`todo-0`} className="todo__status-label">
          {}
          <input
            checked={tempTodo.completed}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo-0`}
            disabled
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled
        >
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label htmlFor={`todo-${id}`} className="todo__status-label">
        {}
        <input
          id={`todo-${id}`}
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleStatus(id, completed);
          }}
        />
      </label>

      {editingId === id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(id);
          }}
        >
          <input
            ref={ref}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingVal}
            onChange={event => {
              setEditingVal(event.target.value);
            }}
            onBlur={() => {
              handleBlur(id);
            }}
            onKeyDown={event => handleKeyDown(event, id)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDouble(id, title)}
        >
          {title}
        </span>
      )}
      {editingId !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(id)}
          disabled={isDeleting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            clearingCompletedIds.has(id) ||
            isDeleting ||
            isUpdatingTitle ||
            updatingStatusIds.has(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
