import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todo: Todo,
  currentId: number | null,
  handleDeleteTodo: (todo: Todo) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<Todo | void>,
  setErrorMessage: (message: Errors | '') => void,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  currentId,
  handleDeleteTodo,
  handleUpdateTodo,
  setErrorMessage,
  setTempTodo,
  setTodos,
}) => {
  const { title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await handleDeleteTodo(todo);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setIsDeleting(true);

      try {
        await handleDeleteTodo(todo);
      } catch {
        setErrorMessage(Errors.DeleteTodoError);
      } finally {
        setIsDeleting(false);
      }
    } else if (trimmedTitle !== title) {
      try {
        const updatedTodo = await handleUpdateTodo({
          ...todo,
          title: trimmedTitle,
        });

        if (updatedTodo !== undefined) {
          setTodos((currentTodos: Todo[]) => {
            return currentTodos.map((item) => (
              item.id === updatedTodo.id ? updatedTodo : item
            ));
          });

          setTempTodo((prevTempTodo: Todo | null) => ({
            ...(prevTempTodo || {}),
            title: updatedTodo?.title || '',
            id: updatedTodo?.id || 0,
            userId: updatedTodo?.userId || 0,
            completed: updatedTodo?.completed || false,
          }));

          setIsEditing(false);
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage(Errors.UpdateTodoError);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleBlur = async (e: React.FormEvent<HTMLInputElement>) => {
    handleSubmit(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      setIsEditing(false);
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => setIsEditing(true)}
      className={classNames('todo', { completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo({ ...todo, completed: !completed })}
          onBlur={handleBlur}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value.trim())}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': currentId === todo.id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
