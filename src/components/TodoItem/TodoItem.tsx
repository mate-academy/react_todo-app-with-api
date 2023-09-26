import {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../TodoContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const {
    isLoading,
    setIsLoading,
    deleteTodo,
    handleTodoUpdate,
    handleStatusChange,
    processingTodoIds,
  } = useContext(TodoContext);
  const {
    id,
    title,
    completed,
  } = todo;

  const isProcessing = processingTodoIds.includes(id);

  const handleTodoDelete = () => {
    deleteTodo(id);
  };

  const handleStatusToggle = () => {
    setIsLoading(true);
    const toggledStatus = !completed;

    handleStatusChange(todo, toggledStatus);
    setIsLoading(false);
  };

  const handleTodoDoubleClick = () => {
    setIsLoading(true);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleTodoSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (trimmedTodoTitle === title) {
      setTodoTitle(trimmedTodoTitle);
      setIsLoading(false);

      return;
    }

    if (trimmedTodoTitle) {
      handleTodoUpdate(todo, trimmedTodoTitle);
    } else {
      handleTodoDelete();
    }

    setIsLoading(false);
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsLoading(false);
    }
  };

  const inputEdit = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isLoading) {
      inputEdit.current?.focus();
    }
  }, [isLoading]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusToggle}
        />
      </label>

      {isLoading
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
              onKeyUp={handleKeyUp}
              ref={inputEdit}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoDelete}
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal', 'overlay', {
            'is-active': isProcessing || id === 0,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
