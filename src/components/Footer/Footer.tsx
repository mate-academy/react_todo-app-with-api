import React, { useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';

import { TodoCount } from '../TodoCount';
import { FiltersNavigation } from '../FiltersNavigation';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

interface Props {
  todos: Todo[];
  filterBy: FilterType;
  onFilter: (filterType: FilterType) => void;
  onDeleteAllTodos: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  onFilter,
  onDeleteAllTodos,
}) => {
  const hasCompletedTodo = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );
  const todosLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length, [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodoCount todosLeft={todosLeft} />

      <FiltersNavigation filterBy={filterBy} onFilter={onFilter} />

      <CSSTransition
        in={hasCompletedTodo}
        timeout={300}
        classNames="todoapp__clear-completed"
        unmountOnExit
      >
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          style={{ visibility: hasCompletedTodo ? 'visible' : 'hidden' }}
          onClick={onDeleteAllTodos}
        >
          Clear completed
        </button>
      </CSSTransition>
    </footer>
  );
};
