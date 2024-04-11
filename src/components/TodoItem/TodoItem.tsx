import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodosContext } from '../../utils/useTodosContext';
import { Loader } from '../Loader';
import { onErrors } from '../../utils/onErrors';
import { updateTodo } from '../../api/todos';
import { Errors } from '../../enums/Errors';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    setTodos,
    loadingTodosIds,
    setLoadingTodosIds,
    onTodoDelete,
    toggleTodo,
    setErrorMessage,
  } = useTodosContext();
  const todoEditRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const isLoading = loadingTodosIds.includes(id);

  const renameTodo = (todoToRename: Todo, newTitle: string) => {
    setLoadingTodosIds(prev => [...prev, todoToRename.id]);

    updateTodo({
      ...todoToRename,
      title: newTitle,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        onErrors(Errors.UpdateTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodosIds([]);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onTodoDelete(id);

      return;
    }

    renameTodo(todo, trimmedTitle);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && todoEditRef.current) {
      todoEditRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
          aria-label="Todo Status"
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={todoEditRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <Loader isLoading={isLoading} />
    </div>
  );
};
