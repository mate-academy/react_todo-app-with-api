import * as React from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ActiveInput } from '../../app/features/focusedSlice';
import { handleAddTodo, handleToggleAll } from './utilsHeader';

export const Header: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);

  const { todos } = useAppSelector(state => state.todos);
  const activeInput = useAppSelector(state => state.forms);
  const dispatch = useAppDispatch();

  const IsAllCompleted = React.useMemo(() => {
    return todos.every(todo => todo.completed === true);
  }, [todos]);

  const addArguments = {
    query: query,
    dispatch: dispatch,
    setQuery: setQuery,
    setIsDisabled: setIsDisabled,
  };

  const toggleArguments = {
    todos: todos,
    dispatch: dispatch,
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: IsAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={event => handleToggleAll({ ...toggleArguments, event })}
        />
      )}

      <form onSubmit={event => handleAddTodo({ ...addArguments, event })}>
        <input
          disabled={isDisabled}
          data-cy="NewTodoField"
          id="header"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value.trimStart())}
          ref={input => activeInput === ActiveInput.isHeader && input?.focus()}
        />
      </form>
    </header>
  );
};
