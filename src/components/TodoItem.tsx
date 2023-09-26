import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (id: number) => void,
  isActive?: boolean,
  handleStatusUpdate: (todo: Todo) => void,
  handleTitleUpdate: (todo: Todo, newTitile: string) => void,
};
export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isActive = false,
  handleStatusUpdate,
  handleTitleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputUpdateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputUpdateRef.current) {
      inputUpdateRef.current.focus();
    }
  }, [isEditing]);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleFormSubmit = () => {
    setIsEditing(false);
    if (newTitle === todo.title) {
      return;
    }

    if (newTitle === '') {
      handleDeleteTodo(todo.id);
    } else {
      handleTitleUpdate(todo, newTitle);
    }
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleStatusUpdate(todo)}
        />
      </label>
      {isEditing
        ? (
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputUpdateRef}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleFormSubmit}
              onKeyUp={handleInputKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {newTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal',
          'overlay',
          { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
