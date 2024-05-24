import { memo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { handleDeleteMultiplePosts } from '../../utils/deleteUtils';
import { useTodoActions } from '../../hooks/useTodosActions';

export const TodoFooter: React.FC = memo(() => {
  const { state } = useContext(AppContext);
  const { todos, filter } = state;
  const actions = useTodoActions();

  const filterOptions: Filter[] = [Filter.All, Filter.Active, Filter.Completed];
  const buttonDisabled = todos.filter(todo => todo.completed).length === 0;
  const activeTodosAmount = todos.filter(todo => !todo.completed).length;

  const handleSetFiltration = (filterOption: number) => {
    actions.setFilter(filterOption);
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = state.todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await handleDeleteMultiplePosts(completedTodoIds, actions);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodosAmount} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filterOptions.map(value => (
              <a
                key={value}
                href={`#/${value === Filter.All ? '' : Filter[value].toLowerCase()}`}
                className={classNames('filter__link', {
                  selected: value === filter,
                })}
                data-cy={`FilterLink${Filter[value]}`}
                onClick={() => handleSetFiltration(value)}
              >
                {Filter[value]}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={buttonDisabled}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
});

TodoFooter.displayName = 'TodoFooter';
