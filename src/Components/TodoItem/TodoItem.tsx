import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, args: UpdateTodoArgs) => Promise<void>;
  loadingItems: number[];
  isLoadingAddTodo: boolean;
}

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo,
  editTodo,
  loadingItems,
  isLoadingAddTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = loadingItems.includes(todo.id)
    || (isLoadingAddTodo && todo.id === 0);

  useEffect(() => {
    if (!inputRef.current && !isEditing) {
      return;
    }

    inputRef.current?.focus();
  }, [isEditing, isLoading]);

  const handleCompleteChange = async () => {
    await editTodo(
      todo.id,
      { completed: !todo.completed },
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = async () => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      removeTodo(todo.id);

      return;
    }

    await editTodo(
      todo.id,
      { title: newTitle },
    );

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTitleChange();
  };

  const deleteTodo = () => removeTodo(todo.id);

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
          onChange={handleCompleteChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={handleInputChange}
            disabled={isLoading}
            onBlur={handleTitleChange}
            ref={inputRef}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
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
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
