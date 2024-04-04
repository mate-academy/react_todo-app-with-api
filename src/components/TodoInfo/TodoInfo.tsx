import cn from 'classnames';

import { useTodos } from '../context/TodosContext';

import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isLoadingItem?: boolean;
};

export const TodoInfo: React.FC<Props> = ({ todo, isLoadingItem = false }) => {
  const { removeTodo, handleCheck, updateTodo } = useTodos();
  const [isLoading, setIsLoading] = useState(isLoadingItem);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRemove = async () => {
    setIsLoading(true);
    await removeTodo(todo.id);
  };

  useEffect(() => {
    if (!isLoading && isEditing) {
      inputRef.current?.focus();
    }
  }, [isLoading, isEditing]);

  const inputId = `todo-status-${todo.id}`;

  async function saveEditedTodo() {
    const trimmedInput = title.trim();

    if (trimmedInput === todo.title || !trimmedInput) {
      if (!trimmedInput) {
        await handleRemove();
      }

      setIsEditing(false);
      setTitle(todo.title);

      return;
    }

    try {
      setIsLoading(true);
      await updateTodo({ ...todo, title: trimmedInput });
      setIsEditing(false);
    } catch (error) {
      setIsEditing(true);
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggle = async (toggleTodo: Todo) => {
    setIsLoading(true);
    try {
      await handleCheck(toggleTodo);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    await saveEditedTodo();
  };

  const handleBlur = async () => {
    await saveEditedTodo();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label htmlFor={inputId} className="todo__status-label">
        <input
          aria-label="TodoStatus"
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          defaultValue={title}
          onChange={() => handleToggle(todo)}
        />
      </label>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onBlur={handleBlur}
            onChange={e => setTitle(e.target.value)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
          />
        </form>
      )}
      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
