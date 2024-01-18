import cn from 'classnames';
import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../context/TodosContext';

type Props = {
  todo: Todo,
  updateTodoItem: (todoId: number, updatedTitle: string) => void,
  deleteTodo: (todoId: number) => void,
  toggleTodoCompleted: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodoItem,
  deleteTodo,
  toggleTodoCompleted,
}) => {
  const {
    isLoading,
    isActiveIds,
    setEditMode,
    setSelectedTodo,
    selectedTodo,
  } = useContext(TodosContext);

  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && selectedTodo?.id === todo.id) {
      inputRef.current?.focus();
    }
  });

  const handleSave = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!updatedTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    if (updatedTitle !== todo.title) {
      updateTodoItem(todo.id, updatedTitle);
    }

    if (updatedTitle === todo.title) {
      setUpdatedTitle(todo.title);
      setEditMode(false);
      setSelectedTodo(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave(e);
    }

    if (e.key === 'Escape') {
      setUpdatedTitle(todo.title);
      setEditMode(false);
      setSelectedTodo(null);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoCompleted(todo.id)}
        />
      </label>

      {selectedTodo?.id === todo.id
        ? (
          <form>
            <input
              type="text"
              ref={inputRef}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setSelectedTodo(todo)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {isActiveIds.includes(todo.id)
        && (
          <div className={cn('modal overlay', {
            'is-active': isLoading,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};
