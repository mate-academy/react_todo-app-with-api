import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todosLoadingState: Todo[],
  onRemoveTodo: (todo: Todo) => void;
  onToogleTodo: (todo: Todo) => void;
  onHandleUpdate: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosLoadingState,
  onRemoveTodo,
  onToogleTodo,
  onHandleUpdate,
}) => {
  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const eventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setTodoTitle(value);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    const trimTodoTitle = todoTitle.trim();

    if (trimTodoTitle === todo.title) {
      return setTodoTitle(title);
    }

    if (!trimTodoTitle) {
      return onRemoveTodo(todo);
    }

    return onHandleUpdate({
      ...todo,
      title: todoTitle,
    });
  };

  const handleCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  const hasLoadingState = todosLoadingState
    .some(todoLoading => todoLoading.id === todo.id);

  const isLoading = todo.id === 0 || hasLoadingState;

  return (
    <li
      className={classNames(
        'todo',
        { completed },
      )}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => {
            onToogleTodo(todo);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleOnSubmit}>
          <input
            type="text"
            value={todoTitle}
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={eventChange}
            onBlur={handleOnSubmit}
            onKeyUp={handleCancelEditing}
          />
        </form>
      ) : (
        <span className="todo__title">{todoTitle}</span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onRemoveTodo(todo);
        }}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
