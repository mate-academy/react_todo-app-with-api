/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import EError from '../utils/EError';

interface ITodoList {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: (error: EError) => void;
}

export const TodoList: React.FC<ITodoList> = ({
  todos,
  setTodos,
  loadingIds,
  setLoadingIds,
  setErrorMessage,
}) => {
  const [editingId, setEdidingId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    setLoadingIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
      setEdidingId(null);
    } catch {
      setErrorMessage(EError.update);
      throw new Error(EError.update);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const handleToggle = async (todo: Todo) => {
    onUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const handleDelete = async (todoId: number) => {
    try {
      setLoadingIds(prev => [...prev, todoId]);
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(EError.delete);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const currentTodo = todos?.find(t => t.id === editingId);

    if (!currentTodo) {
      return;
    }

    const trimmedTitle = tempTitle.trim();

    try {
      if (trimmedTitle === currentTodo.title) {
        setEdidingId(null);

        return;
      }

      if (!trimmedTitle) {
        handleDelete(currentTodo.id);

        return;
      }

      await onUpdateTodo({ ...currentTodo, title: trimmedTitle });

      setEdidingId(null);
    } catch {
      setErrorMessage(EError.update);
    }
  };

  const handleDoubleClick = (todo: Todo) => {
    setEdidingId(todo.id);
    setTempTitle(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEdidingId(null);
    }
  };

  return (
    <>
      {todos?.map(todo => {
        const isProcessing = loadingIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                disabled={isProcessing}
              />
            </label>
            {editingId !== todo.id ? (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    handleDoubleClick(todo);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled={isProcessing}
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  autoFocus
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={tempTitle}
                  onChange={event => setTempTitle(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSubmit}
                />
              </form>
            )}

            {/* Overlay з лоадером */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isProcessing,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};
