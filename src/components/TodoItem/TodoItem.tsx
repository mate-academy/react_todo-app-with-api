import cn from 'classnames';
import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onChangeIds?: number[] | null,
  setOnChangeIds?: React.Dispatch<React.SetStateAction<number[] | null>>,
  handleRemove?: (todoId: number) => void,
  updateCurrentTodo?: (
    todo: Todo,
    title: string,
    completed?: boolean) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onChangeIds = [todo.id],
  setOnChangeIds = () => { },
  handleRemove = () => { },
  updateCurrentTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setEditValue(todo.title);
    setIsEditing(true);
    inputRef.current?.focus();
    document.addEventListener('keyup', handleKeyUp);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    document.removeEventListener('keyup', handleKeyUp);

    if (!editValue.trim()) {
      handleRemove(todo.id);
      setEditValue('');
      setIsEditing(false);

      return;
    }

    if (editValue === todo.title) {
      setEditValue('');
      setIsEditing(false);

      return;
    }

    setOnChangeIds([todo.id]);

    if (updateCurrentTodo) {
      updateCurrentTodo(todo, editValue)
        .finally(() => {
          setEditValue('');
          setIsEditing(false);
          setOnChangeIds(null);
        });
    }
  };

  const handleCheckedClick = () => {
    setOnChangeIds([todo.id]);

    if (updateCurrentTodo) {
      updateCurrentTodo(todo, todo.title, !todo.completed)
        .finally(() => setOnChangeIds(null));
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
          defaultChecked={todo.completed}
          onClick={() => handleCheckedClick()}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              onBlur={() => handleSubmit()}
              ref={inputRef}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleRemove(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={cn('modal overlay', {
          'is-active': onChangeIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
