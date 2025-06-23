import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoTypeErrors, TodoTypeError } from '../constants/TodoTypeErrors';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleTodoDeleted: (todoId: number) => Promise<void>;
  handleToggleCompleted: (todo: Todo) => void;
  isLoading: boolean;
  processingTodoID: number[];
  setProcessingTodoID: (
    value: number[] | ((prev: number[]) => number[]),
  ) => void;
  updateTitle: (id: number, newTitle: string) => Promise<void>;
  setError: (error: TodoTypeError | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleTodoDeleted,
  isLoading,
  handleToggleCompleted,
  processingTodoID,
  setProcessingTodoID,
  updateTitle,
  setError,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef(false);

  useEffect(() => {
    if (editingId !== null) {
      inputRef.current?.focus();
    }
  }, [editingId]);

  const createDeleteHandler = useCallback(
    (id: number) => () => handleTodoDeleted(id),
    [handleTodoDeleted],
  );

  const createToggleHandler = useCallback(
    (todo: Todo) => () => handleToggleCompleted(todo),
    [handleToggleCompleted],
  );

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    submitRef.current = false;
  };

  const cancelEdit = (id: number) => {
    setEditingId(null);
    setEditingTitle('');
    setProcessingTodoID(prev => prev.filter(pid => pid !== id));
  };

  const handleSubmit = async () => {
    if (submitRef.current) {
      return;
    }

    submitRef.current = true;

    if (editingId === null) {
      submitRef.current = false;

      return;
    }

    const todo = todos.find(t => t.id === editingId);

    if (!todo) {
      submitRef.current = false;

      return;
    }

    const trimmed = editingTitle.trim();

    if (!trimmed) {
      setProcessingTodoID(prev => [...prev, todo.id]);
      try {
        await handleTodoDeleted(todo.id);
        setEditingId(null);
      } catch {
        setError(TodoTypeErrors.UnableToDeleteTodo);
      } finally {
        setProcessingTodoID(prev => prev.filter(id => id !== todo.id));
        submitRef.current = false;
      }

      return;
    }

    if (trimmed === todo.title) {
      setEditingId(null);
      submitRef.current = false;

      return;
    }

    setProcessingTodoID(prev => [...prev, todo.id]);

    try {
      await updateTitle(todo.id, trimmed);
      setEditingId(null);
    } catch {
      setError(TodoTypeErrors.UnableToUpdateTodo);
    } finally {
      setProcessingTodoID(prev => prev.filter(id => id !== todo.id));
      submitRef.current = false;
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      if (editingId !== null) {
        cancelEdit(editingId);
      }
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isEditing = editingId === todo.id;
        const isProcessing = processingTodoID.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
              editing: isEditing,
            })}
            key={todo.id}
          >
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isProcessing,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>

            <label
              className="todo__status-label"
              htmlFor={`TodoStatus-${todo.id}`}
            >
              <input
                aria-label="TodoStatus"
                id={`TodoStatus-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={createToggleHandler(todo)}
                disabled={isProcessing}
              />
            </label>

            {isEditing ? (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  ref={inputRef}
                  type="text"
                  className="todo__title-field"
                  value={editingTitle}
                  onChange={event => setEditingTitle(event.target.value)}
                  onBlur={handleSubmit}
                  onKeyUp={handleKeyUp}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEdit(todo)}
              >
                {todo.title}
              </span>
            )}

            {!isEditing && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={createDeleteHandler(todo.id)}
                disabled={isLoading}
              >
                ×
              </button>
            )}
          </div>
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={0}>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <label className="todo__status-label">
            <input
              aria-label="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
              disabled
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};
