import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/todosContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../types/Error';

interface Props {
  todo: Todo;
}

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(todo.title || '');
  const {
    todos,
    onDeleteTodo,
    onUpdateTodo,
    setErrorMessage,
    toggleStatus,
    isAllTodosCompleted,
    setToggleStatus,
    processingIds,
    setProcessingIds,
  } = useContext(TodosContext);

  function handleTodoDelete(todoId: number) {
    setProcessingIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        onDeleteTodo(todoId);
      })
      .catch(() => {
        setErrorMessage(ErrorType.deleteTodo);
        throw new Error(ErrorType.deleteTodo);
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
      });
  }

  function handleUpdateTodo(editedTodo: Todo) {
    setProcessingIds(ids => [...ids, editedTodo.id]);

    updateTodo(editedTodo)
      .then((updatedTodo) => {
        onUpdateTodo(updatedTodo);
        setTitle(updatedTodo.title);
      })
      .catch(() => {
        setErrorMessage(ErrorType.updateTodo);
        throw new Error(ErrorType.updateTodo);
      })
      .finally(() => {
        setIsEditing(false);
        setProcessingIds(ids => ids.filter(id => id !== editedTodo.id));
      });
  }

  function onStatusChange(editedTodo: Todo) {
    handleUpdateTodo({
      ...editedTodo,
      completed: !editedTodo.completed,
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

    handleUpdateTodo(editedTodo);
  }

  useEffect(() => {
    setLoading(processingIds.includes(todo.id));
  }, [processingIds]);

  useEffect(() => {
    if (!toggleStatus) {
      return;
    }

    todos
      .filter(todoItem => todoItem.completed === isAllTodosCompleted)
      .forEach(todoItem => onStatusChange(todoItem));

    setToggleStatus(false);
  }, [toggleStatus]);

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
          onChange={() => onStatusChange(todo)}
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
