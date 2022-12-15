import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { LoaderContext } from './Context/LoaderContext';

interface Props {
  todo: Todo,
  onRemoveTodo: (todoId: number) => Promise<void>,
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoComponent: React.FC<Props> = React.memo(({
  todo,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  const { todoOnLoad, todosOnLoad } = useContext(LoaderContext);
  const [titleChange, setTitleChange] = useState(todo.title);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  const todosOnProccessing = (todoId: number) => {
    if (todoId === 0
      || todoOnLoad === todoId
      || todosOnLoad.find(id => id === todoId)) {
      return true;
    }

    return false;
  };

  const handleTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (todo.title !== titleChange) {
      onUpdateTodo(todo.id, { title: titleChange });
    }

    if (titleChange.trim().length === 0) {
      onRemoveTodo(todo.id);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => onUpdateTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemoveTodo(todo.id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleTitleSubmit}>
            <input
              data-cy="TodoTitleField"
              ref={todoTitleField}
              type="text"
              className="todoapp__new-todo"
              value={titleChange}
              onChange={event => {
                setTitleChange(event.target.value);
              }}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosOnProccessing(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
