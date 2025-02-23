import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { TodoContext } from '../../Context/TodoContext';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Error } from '../../types/Error';
import { useClickOutside } from '../../utils/clickOutside';

type TodoInfoProps = {
  todo: Todo;
};

export const TodoInfo: React.FC<TodoInfoProps> = ({ todo }) => {
  const { deleteTodoLocal, setError, focusInput, todos, updateTodoLocal } =
    React.useContext(TodoContext);

  const [isLoading, setIsLoading] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);

  const isTempTodo = todo.id === 0;

  useEffect(() => {
    if (currentTodo) {
      setIsLoading(true);
      updateTodo(currentTodo)
        .then(() => {
          updateTodoLocal(currentTodo);
          setCurrentTodo(null);
        })
        .catch(() => {
          setError(Error.UpdateTodo);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentTodo, setError, updateTodoLocal]);

  const handleDeleteTodo = (id: number) => () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        deleteTodoLocal(id);
      })
      .catch(() => {
        setError(Error.DeleteTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
    focusInput();
  };

  const handleChangeStatus = (id: number) => {
    const todoToUpdate = todos.find(t => t.id === id);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    setCurrentTodo(updatedTodo);
  };

  const handleDoubleClick = (id: number) => {
    const findTodo = todos.find(t => t.id === id);

    if (findTodo) {
      setEditingTodo(findTodo);
      setEditTitle(findTodo.title);
    }
  };

  const handleUpdateTodo = () => {
    const normEditTitle = editTitle.trim();
    const length = normEditTitle.length > 0;

    if (!editingTodo) {
      return;
    }

    if (!length) {
      handleDeleteTodo(editingTodo.id)();

      return;
    }

    const updatedTodo: Todo = { ...editingTodo, title: normEditTitle };

    if (updatedTodo.title === editingTodo.title) {
      setEditingTodo(null);

      return;
    }

    setIsLoading(true);

    updateTodo(updatedTodo)
      .then(() => {
        updateTodoLocal(updatedTodo);
        setEditingTodo(null);
      })
      .catch(() => {
        setError(Error.UpdateTodo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateTodo();
    }

    if (e.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  useClickOutside(editInputRef, handleUpdateTodo);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          id="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleChangeStatus(todo.id)}
          checked={todo.completed}
        />
      </label>

      {editingTodo?.id === todo.id ? (
        <form>
          <input
            autoFocus
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleUpdateTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodo || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
