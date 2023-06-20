import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodos: number[];
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  loadingTodos,
  removeTodo,
  editTodo,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [isEditing]);

  const submitTodo = useCallback(() => {
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
  }, [todoTitleRef, removeTodo, editTodo]);

  const handleTodoStatusOnClick = () => {
    editTodo(id, { completed: !completed });
  };

  const handleTodoOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submitTodo();
  };

  const handleTodoOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (todoTitleRef.current) {
      todoTitleRef.current.value = event.target.value;
    }
  };

  const handleTodoOnBlur = () => submitTodo();

  const handleTodoOnKeyUp = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleTodoOnDoubleClick = () => setIsEditing(true);

  const handleRemoveButtonOnClick = () => removeTodo(id);

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
          onClick={handleTodoStatusOnClick}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTodoOnSubmit}>
            <input
              ref={todoTitleRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onChange={handleTodoOnChange}
              onBlur={handleTodoOnBlur}
              onKeyUp={handleTodoOnKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleTodoOnDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveButtonOnClick}
            >
              ×
            </button>
          </>
        )}

      <div
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
