import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType,
  deleteTodo: (todoId: number) => void,
  isLoading: boolean,
  isTemporary?: boolean,
  updateTodo?: (updatedTodo: TodoType) => Promise<void>,
  setLoadingTodoId?: (loadingTodoId: number[]) => void,
  handleEditTodo?: (todoId: number, newTitle: string) => void,
}

export const Todo: FC<Props> = (props) => {
  const {
    todo,
    deleteTodo,
    isLoading,
    isTemporary,
    updateTodo,
    setLoadingTodoId,
    handleEditTodo,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  const handleToggle = async () => {
    setLoadingTodoId?.([todo.id]);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await updateTodo?.(newTodo);
    setLoadingTodoId?.([]);
  };

  const titleChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditTitle = () => {
    setIsEditing(true);

    if (editedTitle === todo.title) {
      setIsEditing(false);
    }

    handleEditTodo?.(todo.id, editedTitle);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    }

    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      titleField.current?.focus();
    }
  }, [isEditing, todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
          ref={titleField}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            ref={titleField}
            onKeyUp={handleKeyUp}
            onBlur={handleEditTitle}
            onChange={titleChanger}
          />
        </form>
      )}
      <div className={cn('modal overlay', {
        'is-active': isLoading || isTemporary,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
