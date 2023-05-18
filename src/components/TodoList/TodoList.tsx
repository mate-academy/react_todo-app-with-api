import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoUpdate } from '../../types/todoUpdate';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
  onChange: (id:number, data: TodoUpdate) => void;
  loadingTodoId: number[];

}

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onChange,
  loadingTodoId,

}) => {
  const [chanchingTodoId, setChanchingTodoId] = useState(0);
  const [titleValue, setTitleValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setChanchingTodoId(0);
    }
  };

  const handleRename = (id: number, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!titleValue) {
      onRemove(id);

      return;
    }

    onChange(id, { title: titleValue });
    setChanchingTodoId(0);
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

            <div className={classNames(
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
      })}
    </section>

  );
};
