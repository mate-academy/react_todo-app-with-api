import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { editTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type SingleTodoProps = {
  todo: Todo,
  handleRemove: (todoId: number) => void,
  deletedTodoId: number | null,
  deletedTodosId: number[],
  handleToggleCompleted: (id: number) => void,
  setError: (err: Errors | null) => void,
  onSubmit: () => void,
};

export const SingleTodo
= ({
  todo, handleRemove, deletedTodosId, onSubmit,
  handleToggleCompleted, setError, deletedTodoId,
}: SingleTodoProps) => {
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const saveTodo = (editedTodo: Todo) => {
    setIsEdited(false);

    return editTodo(editedTodo);
  };

  const handleCancelEdit = () => {
    setIsEdited(false);
    setEditedTitle(todo.title);
  };

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleEnter = async () => {
    try {
      const trimmedTitle = editedTitle.trim();

      if (trimmedTitle === '') {
        handleRemove(todo.id);
      } else {
        await saveTodo({ ...todo, title: trimmedTitle });
      }
    } catch {
      setError(Errors.update);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          data-cy="TodoStatus"
          onChange={() => handleToggleCompleted(todo.id)}
        />
      </label>
      {isEdited && (
        <form
          onSubmit={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={input => input && input.focus()}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => {
              handleEnter();
              handleCancelEdit();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEnter();
              }

              if (e.key === 'Escape') {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
          />
        </form>
      )}
      {!isEdited
      && (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => {
              setIsEdited(true);
              setEditedTitle(todo.title);
            }}
          >
            {editedTitle || todo.title}
          </span>
          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            onClick={() => handleRemove(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodosId.includes(todo.id)
          || deletedTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
