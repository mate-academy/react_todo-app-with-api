import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  processedId?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate,
  processedId,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const { id, completed, title } = todo;

  const processedTodos = processedId?.includes(id) || id === 0;

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    setIsEditingTodo({ ...isEditingTodo, title: e.target.value } as Todo);
  };

  const handleTitleUpdate = (newTodo: Todo) => {
    onUpdate(newTodo).then(() => setIsEditingTodo(null));
  };

  const handleEvent = (eventKey?: string) => {
    const event = eventKey === undefined || eventKey === 'Enter';

    if (event && isEditingTodo && isEditingTodo.title.length > 0) {
      if (isEditingTodo.title.trim() !== todo.title) {
        handleTitleUpdate({ ...isEditingTodo, title: newTitle.trim() });
      } else {
        setIsEditingTodo(null);
      }
    }

    if (event && isEditingTodo?.title.length === 0) {
      onDelete(isEditingTodo.id);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleEvent(e.key);

    if (e.key === 'Escape') {
      setIsEditingTodo(null);
    }
  };

  const handleBlur = () => {
    handleEvent();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditingTodo?.id === id ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTodo(todo)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
