import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { DeleteModalContext } from '../../context/DeleteModalContext';

type Props = {
  todo: Todo;
  updateTodo?: (event: React.ChangeEvent<HTMLInputElement>, todo: Todo) => void;
  clearTodo?: (todo: Todo) => void;
  editeTitle?: (todo: Todo, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  clearTodo,
  editeTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editingValue.trim() === '' && clearTodo) {
        clearTodo(todo);
        setIsEditing(false);
      } else if (editingValue === todo.title) {
        setIsEditing(false);
      } else if (editeTitle) {
        editeTitle(todo, editingValue);
        setIsEditing(false);
      }
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingValue(todo.title);
    }
  };

  const onBlur = () => {
    if (editingValue.trim() === '' && clearTodo) {
      clearTodo(todo);
      setIsEditing(false);
    } else if (editingValue === todo.title) {
      setIsEditing(false);
    } else if (editeTitle) {
      editeTitle(todo, editingValue);
      setIsEditing(false);
    }
  };

  const {
    deleteModal,
  } = useContext(DeleteModalContext);

  return (
    <>
      <div
        className={cn('todo', { completed: todo.completed })}
        onDoubleClick={(event) => {
          if (event.target !== inputRef.current) {
            setIsEditing(true);
          }
        }}
      >
        <label className="todo__status-label">
          <input
            ref={inputRef}
            type="checkbox"
            className="todo__status"
            onChange={(event) => {
              if (updateTodo) {
                updateTodo(event, todo);
              }
            }}
            checked={todo.completed}
          />
        </label>

        {isEditing ? (
          <form>
            <input
              type="text"
              ref={inputRef}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingValue}
              onChange={(event) => {
                setEditingValue(event.target.value);
              }}
              onKeyDown={(event) => onKeyDown(event)}
              onBlur={onBlur}
            />
          </form>

        ) : (
          <>
            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                if (clearTodo) {
                  clearTodo(todo);
                }
              }}
            >
              ×
            </button>
          </>
        )}

        <div className={cn(
          'modal overlay', {
            'is-active': deleteModal.includes(
              todo.id,
            ),
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
