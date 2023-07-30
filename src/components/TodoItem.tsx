import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/todosContext';
import { deleteTodo, updateTodo } from '../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(todo.title || '');
  const {
    tempTodo,
    onDeleteTodo,
    onUpdateTodo,
    setErrorMessage,
    deletingCompletedTodo,
  } = useContext(TodosContext);

  function handleTodoDelete(todoId: number) {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => {
        onDeleteTodo(todoId);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  }

  function onStatusChange() {
    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  }

  function onTitleChange(event?: React.FormEvent) {
    event?.preventDefault();

    const normalizedQuery = title.trim();

    if (normalizedQuery === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedQuery) {
      handleTodoDelete(todo.id);
      setIsEditing(false);

      return;
    }

    const editedTodo = {
      ...todo,
      title: normalizedQuery,
    };

    setLoading(true);

    updateTodo(editedTodo)
      .then((updatedTodo) => {
        onUpdateTodo(updatedTodo);
        setTitle(updatedTodo.title);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        throw new Error('Unable to update a todo');
      })
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
      });
  }

  useEffect(() => {
    const isLoading = (deletingCompletedTodo && todo.completed)
      || todo.id === 0;

    setLoading(isLoading);
  }, [deletingCompletedTodo, tempTodo]);

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onTitleChange}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={() => onTitleChange()}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {loading && (
        <div
          className={cn('modal overlay', {
            'is-active': loading,
          })}
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
