/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Error } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => Promise<void>;
  onUpdateTodo: (todoUpdate: Todo) => Promise<void>;
  handleTodoDoubleClick: (id: number | null) => void;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  error: Error;
};

type FormEventSubmit = FocusEvent | React.FormEvent<HTMLFormElement>;

export const CompletedTodo: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    onDelete,
    onUpdateTodo,
    handleTodoDoubleClick,
    editingTodoId,
    setEditingTodoId,
    error,
  } = props;

  const [todoInputValue, setTodoInputValue] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId === todo.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodoId, todo.id]);

  const onCheckTodo = () => {
    const toUpdateTodo = { ...todo, completed: !todo.completed };

    onUpdateTodo(toUpdateTodo);
  };

  const focusTodoInput = () => {
    if (error) {
      inputRef.current?.focus();
    }
  };

  const handleSubmitEditingTodo = async (event: FormEventSubmit) => {
    event.preventDefault();

    const trimmedTodo = todoInputValue.trim();

    setTodoInputValue(trimmedTodo);

    try {
      if (trimmedTodo === todo.title) {
        setEditingTodoId(null);

        return;
      }

      if (trimmedTodo) {
        await onUpdateTodo({ ...todo, title: trimmedTodo });
        setEditingTodoId(null);
      } else {
        await onDelete(todo.id);
        setEditingTodoId(null);
      }

      handleTodoDoubleClick(null);
    } catch (err) {
      focusTodoInput();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', todo.completed ? 'completed' : '')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onCheckTodo}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={handleSubmitEditingTodo}
          onBlur={event => {
            handleSubmitEditingTodo(event);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoInputValue}
            onChange={event => setTodoInputValue(event.target.value)}
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={event => {
            event.preventDefault();
            handleTodoDoubleClick(todo.id);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id ? (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      ) : (
        ''
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
