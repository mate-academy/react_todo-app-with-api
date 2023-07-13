import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { updateTodo, deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isUpdating: boolean;
  updatingIds: number[];
  handleIsUpdating: (status: boolean) => void;
  handleUpdatingIds: (ids: number[]) => void;
  handleError: (error: string) => void;
  handleLoadTodos: () => void;
}

const TodoItem: React.FC<Props> = ({
  todo,
  isUpdating,
  updatingIds,
  handleIsUpdating,
  handleUpdatingIds,
  handleError,
  handleLoadTodos,
}) => {
  const { id, title, completed } = todo;
  const [editTodo, setEditTodo] = React.useState<Todo | null>(null);
  const [newTitle, setNewTitle] = React.useState('');

  const titleRef = useRef<HTMLInputElement | null>(null);

  const handleUpdateCompleted = () => {
    handleIsUpdating(true);
    handleUpdatingIds([id]);
    const updatedTodo = {
      completed: !completed,
    };

    updateTodo(id, updatedTodo)
      .then(() => handleLoadTodos())
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => handleIsUpdating(false));
  };

  const handleEditTodo = () => {
    setEditTodo(todo);
    setNewTitle(todo.title);
  };

  const handleDeleteTodo = () => {
    handleIsUpdating(true);
    handleUpdatingIds([id]);
    deleteTodo(id)
      .then(() => handleLoadTodos())
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => handleIsUpdating(false));
  };

  const handleTitleSubmit = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    event.preventDefault();
    if (!newTitle.trim()) {
      handleDeleteTodo();

      return;
    }

    const updatedTodo = {
      title: newTitle.trim(),
    };

    handleIsUpdating(true);
    handleUpdatingIds([todoId]);
    updateTodo(todoId, updatedTodo)
      .then(() => handleLoadTodos())
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => {
        setEditTodo(null);
        setNewTitle('');
        handleIsUpdating(false);
      });
  };

  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTodo(null);
    }
  };

  const handleFocus = () => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };

  useEffect(() => {
    handleFocus();
  }, [editTodo]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateCompleted}
        />
      </label>

      {editTodo && editTodo.id === id ? (
        <form onSubmit={(event) => handleTitleSubmit(event, id)}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleNewTitleChange}
            onBlur={(event) => handleTitleSubmit(event, id)}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleEditTodo}>
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isUpdating && updatingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
