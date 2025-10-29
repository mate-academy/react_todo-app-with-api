/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoForm } from '../TodoForm/TodoForm';

interface TodoProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todo: Todo['id']) => void;
  processingTodos?: Todo['id'][] | null;
  onUpdateStatus?: (todoId: Todo['id'], todoStatus: Todo['completed']) => void;
  onUpdateTitle?: (
    todoId: Todo['id'],
    newTitle: Todo['title'],
  ) => Promise<unknown>;
}

export const TodoInfo = React.forwardRef<HTMLDivElement, TodoProps>(
  (
    {
      todo,
      isLoading = false,
      onDelete = () => {},
      processingTodos,
      onUpdateStatus = () => {},
      onUpdateTitle = () => Promise.resolve(),
    },
    ref,
  ) => {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [newTitle, setNewTitle] = useState(todo.title);
    const [needsRefocus, setNeedsRefocus] = useState(false);
    const focusedInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (needsRefocus && editingTodo && focusedInput.current) {
        focusedInput.current.focus();
        setNeedsRefocus(false);
      }
    }, [editingTodo, needsRefocus]);

    const handleSave = async () => {
      const trimmedTitle = newTitle.trim();

      setNewTitle(trimmedTitle);

      if (trimmedTitle === todo.title) {
        setEditingTodo(null);

        return;
      }

      if (trimmedTitle === '') {
        onDelete(todo.id);

        return;
      }

      try {
        await onUpdateTitle(todo.id, trimmedTitle);

        setEditingTodo(null);
      } catch (error) {
        setNeedsRefocus(true);
      }
    };

    const handleCancel = () => {
      setEditingTodo(null);
      setNewTitle(todo.title);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSave();
      }

      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    return (
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
        ref={ref}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {
              onUpdateStatus(todo.id, !todo.completed);
            }}
          />
        </label>
        {editingTodo ? (
          <TodoForm
            focusedInput={focusedInput}
            todoTitle={newTitle}
            onTitleChange={setNewTitle}
            onEnterKeyPressed={handleKeyDown}
            isDisabled={isLoading || !!processingTodos?.includes(todo.id)}
            onBlur={handleSave}
            isEditing={true}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setNewTitle(todo.title);
                setEditingTodo(todo);
                setNeedsRefocus(true);
              }}
            >
              {newTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading || processingTodos?.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoInfo.displayName = 'TodoInfo';
