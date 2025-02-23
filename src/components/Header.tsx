import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect } from 'react';
import { TodoCount } from '../types/TodoCount';

type Props = {
  todos: Todo[];
  title: string;
  isLoading: boolean;
  focusField: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setTitle: (title: string) => void;
  onToggleAll: () => void;
  getTodosStateStatistic: (todos: Todo[]) => TodoCount;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  isLoading,
  focusField,
  onSubmit,
  setTitle,
  onToggleAll,
  getTodosStateStatistic,
}) => {
  const todoStatistics = getTodosStateStatistic(todos);

  useEffect(() => {
    if (focusField) {
      focusField.current?.focus();
    }
  }, [focusField, isLoading]);

  return (
    <header className="todoapp__header">
      {(todoStatistics.activeTodos > 0 || todoStatistics.todoCompleted > 0) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todoStatistics.activeTodos === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={focusField}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
