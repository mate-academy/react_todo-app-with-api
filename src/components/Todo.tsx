import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoType } from '../types/TodoType';
import { deleteTodo, updateTodo } from '../api/todos';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  handleNewTitle: (id: number, newTitle?: string) => void;
  loading: boolean
  setTodoLoading: (id: number, boolean: boolean) => void
  handleRequestError: (arg0: string) => void;
}

const Todo = (
  {
    todo, onToggle, onDelete, handleNewTitle, loading,
    setTodoLoading, handleRequestError,
  }: TodoProps,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (loading) {
      return;
    }

    setTodoLoading(todo.id, true);
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      deleteTodo(todo.id)
        .then(() => {
          onDelete(todo.id);
          setTodoLoading(todo.id, false);
        })
        .catch(error => {
          setTodoLoading(todo.id, false);
          handleRequestError('Unable to delete a todo');
          // eslint-disable-next-line no-console
          console.error(`Error deleting todo with id ${todo.id}:`, error);
        });
    } else if (trimmedTitle === todo.title) {
      setIsEditing(false);
      setTodoLoading(todo.id, false);
    } else {
      updateTodo(todo.id, { title: editedTitle.trim() })
        .then(updatedTodo => {
          handleNewTitle(todo.id, updatedTodo.title.trim());
          setIsEditing(false);
          setTodoLoading(todo.id, false);
        })
        .catch(error => {
          handleRequestError('Unable to update a todo');
          // eslint-disable-next-line no-console
          console.error(`Error updating todo title with id ${todo.id}:`, error);
          setTodoLoading(todo.id, false);
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveClick();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSaveClick}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveClick}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditClick}
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

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default Todo;
