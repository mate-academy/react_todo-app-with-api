/* eslint-disable max-len */
import React, {
  Dispatch, SetStateAction, useRef, useState,
} from 'react';
import cn from 'classnames';
import { ErrorType, Todo } from '../types';
import { deleteTodo, updateTodo } from '../api/todos';

interface Props {
  todo: Todo
  handleDeleteTodo: (id: number) => void
  isLoading: number[]
  tempTodo: Todo | null
  setTodos: Dispatch<SetStateAction<Todo[]>>
  handleError: (error: ErrorType) => void
  setIsLoading: Dispatch<SetStateAction<number[]>>
  handleEditTodo: (todoId: number, newTitle: string) => void
}

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    handleDeleteTodo,
    isLoading,
    tempTodo,
    setTodos,
    handleError,
    setIsLoading,
    handleEditTodo,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const titleFieldRef = useRef<HTMLInputElement>(null);

  const handleEditTitle = () => {
    setIsEditing(true);

    if (editedTitle.trim() === '') {
      deleteTodo(todo.id);
    }

    if (editedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    handleEditTodo?.(todo.id, editedTitle);
    setIsEditing(false);
  };

  const titleChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    }

    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const setTodoCompleted = (todoToUpdate: Todo): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(prev => [...prev, todoToUpdate.id]);
      updateTodo(todoToUpdate.id, todoToUpdate)
        .then(updatedTodo => {
          setTodos(currentTodos => {
            return currentTodos
              .map(el => (el.id === todoToUpdate.id ? updatedTodo : el));
          });
          resolve();
        })
        .catch(() => {
          handleError(ErrorType.UPDATE);
          reject();
        })
        .finally(() => {
          setIsLoading(prev => prev.filter(id => id !== todoToUpdate.id));
        });
    });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);

    setTimeout(() => titleFieldRef.current?.focus(), 0);
  };

  const handleToggle = async () => {
    setTodoCompleted?.(todo);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await setTodoCompleted?.(newTodo);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggle}
          checked={todo.completed}
        />
      </label>

      {!isEditing ? (
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
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleEditTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={editedTitle}
              ref={titleFieldRef}
              onKeyUp={handleKeyUp}
              onBlur={handleEditTitle}
              onChange={titleChanger}
            />
          </form>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading.includes(todo.id) || todo.id === tempTodo?.id,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
