/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Todo) => void,
  isLoading: boolean;
  changeErrorMessage: (value: string) => void,
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  isLoading,
  changeErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTodo = { ...todo, completed: event.target.checked };

    updateTodo(updatedTodo);
  };

  const handleTrim = (title: string) => title.replace(/\s+/g, ' ').trim();

  const handleDoubleClick = (edited: Todo) => {
    inputRef.current?.focus();
    setIsEditing(true);
    setNewTodoTitle(handleTrim(edited.title));
  };

  const handleButtons = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedTitle = handleTrim(todo.title);

    if (event.key === 'Enter') {
      try {
        if (newTodoTitle === todo.title) {
          setIsEditing(false);

          return;
        }

        if (!newTodoTitle) {
          event.preventDefault();
          deleteTodo(todo.id);
        }

        setIsEditing(false);
        setNewTodoTitle(trimmedTitle);
        updateTodo({ ...todo, title: newTodoTitle });
      } catch {
        changeErrorMessage('Unable to update todo');
        setNewTodoTitle(todo.title);
      }
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTodoTitle(trimmedTitle);
    }
  };

  const handleBlur = (editedTodo: Todo) => {
    const trimmedTitle = handleTrim(editedTodo.title);

    setNewTodoTitle(trimmedTitle);
    setIsEditing(false);

    if (newTodoTitle === trimmedTitle) {
      return;
    }

    if (!newTodoTitle) {
      deleteTodo(editedTodo.id);
    }

    updateTodo({ ...editedTodo, title: trimmedTitle });
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onBlur={() => handleBlur(todo)}
            onKeyDown={handleButtons}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isLoading || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
