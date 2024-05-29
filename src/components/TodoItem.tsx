import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../contexts/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    tempTodo,
    removeTodo,
    loadingTodosIds,
    changeCompleteTodo,
    setTodos,
    showError,
    setIsLoading,
    setLoadingTodosIds,
  } = useTodos();
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
  };

  const updateTitle = () => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, id]);
    setEditedText(title);

    if (!editedText.trim()) {
      deleteTodo(id)
        .then(() =>
          setTodos(prevTodos =>
            prevTodos.filter((todoItem: Todo) => todoItem.id !== id),
          ),
        )
        .catch(() => {
          showError(ErrorMessages.DeleteTodo);
          setIsEditing(true);
        })
        .finally(() => {
          setLoadingTodosIds(prevTodosIds =>
            prevTodosIds.filter(todoId => todoId !== id),
          );
        });

      return;
    }

    updateTodo(id, { title: editedText })
      .then(response => setTodos(prevTodos => [...prevTodos, response]))
      .catch(() => {
        showError(ErrorMessages.UpdateTodo);
        setIsEditing(true);
      })
      .finally(() => {
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);

      return;
    }
  };

  if (tempTodo) {
    loadingTodosIds.push(tempTodo.id);
  }

  const isActive = loadingTodosIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" aria-label="Todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => changeCompleteTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            setIsEditing(false);
            updateTitle();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedText}
            autoFocus
            onChange={handleChange}
            onKeyUp={handleEscape}
            onBlur={() => {
              setIsEditing(false);
              updateTitle();
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title.trim()}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
