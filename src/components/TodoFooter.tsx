/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../types/enum';
import { TodoContext } from '../TodoContext';
import { TodoContextProps } from '../types/interfaces';

export const TodoFooter = () => {
  const { state, setState, deleteAllCompleted } = useContext(TodoContext) as TodoContextProps;

  const itemsLeft = state.todos.filter(todo => !todo.completed).length;
  const completedTodos = state.todos.filter(todo => todo.completed);

  function onChangeStatus(onFilter: Filter) {
    setState(prev => ({
      ...prev,
      filter: onFilter,
    }));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: state.filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeStatus(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: state.filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeStatus(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: state.filter === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeStatus(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        disabled={!completedTodos.length}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
