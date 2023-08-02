import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

import { TodoFilter } from './TodoFilter';
import { useMemo } from 'react';

type Props = {
  todos: Todo[],
  filterValue: FilterTypes,
  setFilterValue: (value: FilterTypes) => void,
  onClearBtn: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterValue,
  setFilterValue,
  onClearBtn,
}) => {
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed)
  }, [todos]);

  const completedTodosAmount = useMemo(() => {
    return todos.some(todo => todo.completed)
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length}
        {' '}
        items left
      </span>

      <TodoFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {'todoapp__clear-completed-hide': !completedTodosAmount},
        )}
        onClick={onClearBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};
