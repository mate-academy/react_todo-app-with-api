/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  editingTodos: number[];
  handleToggleCompleted: (id: number) => void;
  renamingTodo: number | null;
  setRenamingTodo: (id: number | null) => void;
  handleUpdateTodoTitle: (id: number, title: string) => void;
};

const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  editingTodos,
  handleToggleCompleted,
  renamingTodo,
  setRenamingTodo,
  handleUpdateTodoTitle,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const isRenaming = renamingTodo === todo.id;

  const todoField = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggle = () => {
    handleToggleCompleted(todo.id);
  };

  const handleEditTodo = () => {
    setRenamingTodo(todo.id);
    setInputValue(todo.title);
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmitChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue === '') {
      onDelete(todo.id);

      return;
    }

    if (inputValue !== todo.title) {
      handleUpdateTodoTitle(todo.id, inputValue);
      setRenamingTodo(null);

      return;
    }

    setRenamingTodo(null);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRenamingTodo(null);

        return;
      }
    };

    window.addEventListener('keyup', handleEsc);

    return () => {
      window.removeEventListener('keyup', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [renamingTodo]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {!isRenaming && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEditTodo}
        >
          {todo.title}
        </span>
      )}

      {isRenaming && (
        <form onSubmit={handleSubmitChange} onBlur={handleSubmitChange}>
          <input
            ref={todoField}
            className="todo__title-field"
            type="text"
            value={inputValue}
            onChange={handleChangeValue}
          />
        </form>
      )}

      {!isRenaming && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': editingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
