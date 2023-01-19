import classNames from 'classnames';
import { useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  activeTodos: Todo[],
  title: string,
  setTitle: (title: string) => void,
  onAdd: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  onChangeStatusAll: () => void,
};

export const Header: React.FC<Props> = (props) => {
  const {
    todos,
    activeTodos,
    title,
    setTitle,
    onAdd,
    onChangeStatusAll,
  } = props;

  const newTodoTitle = useRef<HTMLInputElement>(null);

  return (
    <header className="todoapp__header">
      <form onSubmit={onAdd}>
        <p className="control is-expanded has-icons-left has-icons-right">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              aria-label="ToggleAll"
              className={classNames('todoapp__toggle-all',
                {
                  'todoapp__toggle-all active': !activeTodos.length,
                })}
              onClick={() => onChangeStatusAll()}
            />
          )}

          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoTitle}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />

          {title.length > 0 && (
            <span
              className="icon is-right"
              style={{
                pointerEvents: 'all',
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                data-cy="clearSearchButton"
                type="button"
                className="delete todoapp__icon-delete"
                onClick={() => setTitle('')}
              />
            </span>
          )}
        </p>
      </form>
    </header>
  );
};
