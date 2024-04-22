import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { KeyboardEvent } from '../../types/KeyboardEvent';

type FormInputEvent =
  | React.FormEvent<HTMLFormElement>
  | React.ChangeEvent<HTMLInputElement>;

type Props = {
  todo: Todo;
  multipleLoading: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  multipleLoading,
  onDelete,
  onUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoTitleChanged, setTodoTitleChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleTodoTitleClick = () => setSelectedTodo(todo);

  const handleTodoCompletedChange = () => {
    setLoading(true);
    onUpdate?.({ ...todo, completed: !todo.completed }).finally(() =>
      setLoading(false),
    );
  };

  const handleTodoDelete = (todoId: number) => {
    setLoading(true);
    onDelete?.(todoId).finally(() => setLoading(false));
  };

  const handleTodoTitleSet = (event: FormInputEvent) => {
    setTodoTitleChanged(true);
    setTodoTitle(event.currentTarget.value);
  };

  const handleTodoTitleChange = (event: FormInputEvent) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    if (!isError) {
      setLoading(true);
      if (trimmedTitle.length === 0 && selectedTodo) {
        handleTodoDelete(selectedTodo?.id);
      } else {
        onUpdate?.({ ...todo, title: trimmedTitle })
          .then(() => setSelectedTodo(null))
          .catch(() => {
            setIsError(true);
            setSelectedTodo(selectedTodo);
          })
          .finally(() => setLoading(false));
      }
    } else {
      setIsError(false);
      setTodoTitleChanged(false);
    }
  };

  const handleTodoTitleBlur = (event: FormInputEvent) => {
    if (todoTitleChanged) {
      handleTodoTitleChange(event);
    } else {
      setSelectedTodo(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KeyboardEvent.Escape) {
      setSelectedTodo(null);
    }

    if (
      event.key === KeyboardEvent.Enter &&
      todoTitle.length !== 0 &&
      selectedTodo
    ) {
      handleTodoTitleClick();
    }

    if (
      event.key === KeyboardEvent.Enter &&
      todoTitle.length === 0 &&
      selectedTodo
    ) {
      handleTodoDelete(selectedTodo?.id);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoCompletedChange}
        />
      </label>

      {todo.id !== selectedTodo?.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleTodoTitleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleTodoTitleChange}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleSet}
            onBlur={handleTodoTitleBlur}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </form>
      )}

      {!selectedTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleTodoDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading || multipleLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
