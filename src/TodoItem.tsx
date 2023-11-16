import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodosContext } from './TodoContext';

type Props = {
  todo: Todo;
  isProcessed: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed }) => {
  const {
    removeTodo,
    updateCurrentTodo,
  } = useContext(TodosContext);

  const [isEdited, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editref.current && isEdited) {
      editref.current.focus();
    }
  }, [isEdited]);

  const toggleTodo = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateCurrentTodo({ ...todo, completed: event.target.checked });
  }, [todo, updateCurrentTodo]);

  const handleTitleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSavingTitle = useCallback(() => {
    if (!editTitle.trim()) {
      removeTodo(todo.id);
    } else if (editTitle === todo.title) {
      setIsEditing(false);
    } else {
      updateCurrentTodo({ ...todo, title: editTitle });
      setIsEditing(false);
    }
  }, [editTitle, removeTodo, todo, updateCurrentTodo]);

  const handleEditBlur = () => {
    handleSavingTitle();
  };

  const handleOnKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);

      return;
    }

    if (event.key === 'Enter') {
      handleSavingTitle();
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {editTitle ? (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyDown={handleOnKeyDown}
          onBlur={handleEditBlur}
          ref={editref}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTitleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
