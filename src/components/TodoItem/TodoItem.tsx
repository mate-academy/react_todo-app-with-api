import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoUpdate } from '../../types/todoUpdate';

interface Props {
  todo: Todo;
  onRemove: (id: number) => void;
  onChange: (id:number, data: TodoUpdate) => void;
  loadingTodoId: number[];

}

export const TodItem: React.FC<Props> = ({
  todo,
  onRemove,
  onChange,
  loadingTodoId,
}) => {
  const [chanchingTodoId, setChanchingTodoId] = useState(0);
  const [titleValue, setTitleValue] = useState('');

  const { id, title, completed } = todo;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setChanchingTodoId(0);
    }
  };

  const handleRename = (todoId: number, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!titleValue) {
      onRemove(todoId);

      return;
    }

    onChange(todoId, { title: titleValue });
    setChanchingTodoId(0);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div key={id} className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={!!completed}
          onChange={(event) => onChange(
            id,
            { completed: event.target.checked },
          )}
        />
      </label>

      {chanchingTodoId === id
        ? (
          <form
            onSubmit={(event) => handleRename(id, event)}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={titleValue}
              onFocus={() => setTitleValue(title)}
              onChange={(event) => setTitleValue(event.target.value)}
              onBlur={() => handleRename(id)}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setChanchingTodoId(id)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={cn(
        'modal',
        'overlay',
        { 'is-active': loadingTodoId?.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
