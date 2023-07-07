import React, {
  FC,
  useState,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodoIds: number[];
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  loadingTodoIds,
  removeTodo,
  editTodo,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [isEditing]);

  const submitTodo = () => {
    const newTitle = todoTitleRef.current?.value;

    if (newTitle && newTitle.trim() === title.trim()) {
      setIsEditing(false);

      return;
    }

    if (newTitle) {
      editTodo(id, { title: newTitle });
    } else {
      removeTodo(id);
    }

    setIsEditing(false);
  };

  const handleTodoStatusClick = () => {
    editTodo(id, { completed: !completed });
  };

  const handleTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submitTodo();
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (todoTitleRef.current) {
      todoTitleRef.current.value = event.target.value;
    }
  };

  const handleTodoKeyUp = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleTodoBlur = () => submitTodo();

  const handleTodoDoubleClick = () => setIsEditing(true);

  const handleRemoveButtonClick = () => removeTodo(id);

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleTodoStatusClick}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTodoSubmit}>
            <input
              ref={todoTitleRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onChange={handleTodoChange}
              onKeyUp={handleTodoKeyUp}
              onBlur={handleTodoBlur}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveButtonClick}
            >
              ×
            </button>
          </>
        )}

      <div
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
