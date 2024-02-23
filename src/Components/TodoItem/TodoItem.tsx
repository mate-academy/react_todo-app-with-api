import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../Types/Todo';
import { TodosContext } from '../Store/Store';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
  const {
    errorMessage,
    setTodos,
    isProcessing,
    setErrorMessage,
    addProcessing,
    removeProcessing,
    deleteTodo,
    updateTodo,
  } = useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const todoField = useRef<HTMLInputElement>(null);

  const handleEditTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id);
  };

  const handleCheckbox = () => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  const applyEditing = async () => {
    if (editTitle.trim() === todo.title) {
      setIsEditing(false);
    }

    if (editTitle.trim().length === 0) {
      handleDeleteTodo();

      return;
    }

    if (editTitle.trim() !== todo.title && editTitle.length !== 0) {
      addProcessing(todo.id);
      try {
        const updatedTodo = { ...todo, title: editTitle.trim() };

        await client.patch(`/${todo.id}`, { title: editTitle.trim() });
        setTodos(current =>
          current.map(upTodo =>
            upTodo.id === updatedTodo.id ? updatedTodo : upTodo,
          ),
        );
        setIsEditing(false);
      } catch {
        setErrorMessage('Unable to update a todo');
        removeProcessing(todo.id);

        return;
      } finally {
        removeProcessing(todo.id);
      }
    }
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    applyEditing();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if ((isEditing && errorMessage) || isEditing) {
      todoField.current?.focus();
    }
  }, [isEditing, errorMessage]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={todoField}
            value={editTitle}
            onChange={handleEditTitle}
            onBlur={applyEditing}
            onKeyUp={handleKeyUp}
            placeholder="Empty todo will be deleted"
            disabled={isProcessing.includes(todo.id)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
