import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isLoading: boolean;
  isEditingTodos: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  isEditingTodos,
  setErrorMessage,
  setLoadingTodoIds,
  setTodos,
}) => {
  const { title, completed, id } = todo;

  const [editedTitle, setEditedTitle] = useState(title);
  const [editingTodos, setEditingTodos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodos && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodos]);

  useEffect(() => {
    if (isEditingTodos) {
      setEditingTodos(false);
    }
  }, [isEditingTodos]);

  const handleDoubleClick = () => {
    setEditingTodos(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    setLoadingTodoIds(ids => [...ids, id]);
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(id);
      setIsSubmitting(false);
      return;
    }

    if (trimmedTitle !== title) {
      updateTodo({ ...todo, title: trimmedTitle })
        .then(() => {
          setEditedTitle(trimmedTitle);
          setEditingTodos(false);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setLoadingTodoIds(ids => ids.filter(todoId => todoId !== id));
          setIsSubmitting(false);
        });
    } else {
      setEditingTodos(false);
      setLoadingTodoIds(ids => ids.filter(todoId => todoId !== id));
      setIsSubmitting(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditingTodos(false);
      setLoadingTodoIds(ids => ids.filter(todoId => todoId !== id));
    }
  };

  const toggleTodoStatus = (todo: Todo) => {
    setLoadingTodoIds(ids => [...ids, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => toggleTodoStatus(todo)}
          checked={completed}
        />
      </label>

      {editingTodos ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={inputRef}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editedTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || (editingTodos && isSubmitting),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
