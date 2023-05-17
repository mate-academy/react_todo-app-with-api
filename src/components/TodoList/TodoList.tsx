import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
  onChange: (id:number, data: boolean | string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onChange,
}) => {
  const [onChanging, setOnChanging] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOnChanging(false);
    }
  };

  const handleRename = (id: number, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
      onChange(id, titleValue);
    }

    onChange(id, titleValue);
    setOnChanging(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const { title, completed, id } = todo;

        return (
          <div key={id} className={classNames('todo', { completed })}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={!!completed}
                onChange={(event) => onChange(id, event.target.checked)}
              />
            </label>

            {onChanging
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
                    onDoubleClick={() => setOnChanging(true)}
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

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>

  );
};
