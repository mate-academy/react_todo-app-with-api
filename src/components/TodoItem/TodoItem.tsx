import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodosContext';
import { deleteTodos, patchTodos } from '../../api/todos';
import { ErrorContext } from '../../context/ErrorContext';

interface Props {
  todo: Todo;
  isCurrentLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isCurrentLoading }) => {
  const { dispatch } = useContext(TodoContext);
  const { handleErrorMessage } = useContext(ErrorContext);

  const [todoTitle, setTodoTitle] = useState(todo.title);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(isCurrentLoading);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDeleteTodo = async () => {
    try {
      setIsLoading(true);
      await deleteTodos(todo.id);

      dispatch({
        type: 'DELETE_TODO',
        payload: todo.id,
      });
    } catch (error) {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleStatusChange = async () => {
    try {
      setIsLoading(true);
      const updatedTodo = { ...todo, completed: !todo.completed };

      await patchTodos(updatedTodo);

      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch {
      handleErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const saveChanges = async () => {
    if (todo.title.trim() !== todoTitle) {
      setIsLoading(true);
      try {
        if (todoTitle.trim() === '') {
          await handleDeleteTodo();
        } else {
          const updatedTodo = { ...todo, title: todoTitle.trim() };

          await patchTodos(updatedTodo);

          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
          setIsEditing(false);
        }
      } catch (error) {
        handleErrorMessage('Unable to update a todo');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setTodoTitle(todo.title);
    setIsEditing(false);
  };

  const handleTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveChanges();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      key={todo.id}
      className={cn('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleTodoSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTitleChange}
            onKeyUp={event => handleKeyUp(event)}
            onBlur={saveChanges}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
