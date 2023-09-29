import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { PrevTodos, PrevProcessingTodoIds } from '../types/PrevState';

type Props = {
  todo: Todo;
  onTodosChange?: (todos: Todo[] | PrevTodos) => void;
  isProcessing: boolean;
  onToggleTodo?: (todo: Todo) => void;
  onDeleteTodo?: (todoId: number) => void;
  onErrorMessageChange?: (error: string) => void;
  onProcessingTodoIdsChange?: (
    todoIds: number[] | PrevProcessingTodoIds
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onToggleTodo = () => {},
  onDeleteTodo = () => {},
  onTodosChange = () => {},
  onErrorMessageChange = () => {},
  onProcessingTodoIdsChange = () => {},
}) => {
  const { title, id, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleUpdateTodo = (newTodoTitle: string) => {
    if (newTodoTitle.trim() === title) {
      return;
    }

    if (!newTodoTitle.trim()) {
      onDeleteTodo(id);

      return;
    }

    onErrorMessageChange('');
    onProcessingTodoIdsChange((prevTodoIds) => [...prevTodoIds, todo.id]);

    updateTodo({
      ...todo,
      title: newTodoTitle,
    })
      .then(updatedTodo => {
        onTodosChange(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        onErrorMessageChange('Unable to update a todo');
      })
      .finally(() => {
        onProcessingTodoIdsChange(
          (prevTodoIds) => prevTodoIds.filter(todoId => todoId !== todo.id),
        );
      });
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await handleUpdateTodo(todoTitle);
    } else {
      await onDeleteTodo(id);
    }

    setTodoTitle(todoTitle.trim());
    setIsEditing(false);
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput) {
      titleInput.current?.focus();
    }
  }, [isEditing]);

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onKeyUp={handleKeyUp}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInput}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

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
};
