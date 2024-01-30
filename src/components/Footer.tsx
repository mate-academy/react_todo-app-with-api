/* eslint-disable max-len */
import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Todo, FilterType } from '../types';

interface Props {
  todos: Todo[]
  setFilterType: (value: FilterType) => void
  filterType: string
  setIsLoading: Dispatch<SetStateAction<number[]>>
  handleDeleteTodo: (id: number) => void
}

export const Footer: React.FC<Props> = (props) => {
  const {
    todos,
    setFilterType,
    filterType,
    setIsLoading,
    handleDeleteTodo,
  } = props;

  const remainingTodosLength = todos.filter(todo => !todo.completed).length;
  const completedTodosLength = todos.filter(todo => todo.completed).length;

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsLoading(prev => Array.prototype.concat([...prev], completedTodos));

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterType === FilterType.ALL })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filterType === FilterType.ACTIVE })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterType === FilterType.COMPLETED })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed hidden"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
        style={{
          visibility: completedTodosLength !== 0
            ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
