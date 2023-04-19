import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deletingTodoId: number,
  onRemoveTodo: (id: number) => void,
  isDeletingCompleted: boolean,
  onChangeTitle: (todo: Todo, title: string) => void,
  onToggleTodo: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingTodoId,
  onRemoveTodo,
  isDeletingCompleted,
  onChangeTitle,
  onToggleTodo,
}) => {
  const isTodoChanging = (todo.id === 0
    || deletingTodoId === todo.id
    || (isDeletingCompleted && todo.completed));
  const [isEdited, setIsEdited] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const handleChangeTitle = () => {
    setIsEdited(false);
    if (!newTodoTitle.trim()) {
      onRemoveTodo(todo.id);
    }

    if (newTodoTitle !== todo.title) {
      onChangeTitle(todo, newTodoTitle);
    }
  };

  const closeInputByEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setNewTodoTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleTodo(todo)}
        />
      </label>

      {isEdited
        ? (
          <form
            onSubmit={handleChangeTitle}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be delete"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onBlur={handleChangeTitle}
              onKeyDown={closeInputByEscape}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdited(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isTodoChanging,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
