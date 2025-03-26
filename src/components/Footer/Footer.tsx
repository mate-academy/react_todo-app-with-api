import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../enum/Filter';
import {
  completedTodoId,
  notCompletedTodoCounter,
} from '../../services/todoFunction';
import classNames from 'classnames';

type Props = {
  filterData: (value: Filter) => void;
  todos: Todo[];
  deleteTodos: (id: number) => void;
  changeDeleteIds: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  filterData,
  todos,
  deleteTodos,
  changeDeleteIds,
}) => {
  const [select, setSelect] = useState(Filter.All);

  const handleClick = (filter: Filter) => {
    setSelect(filter);
    filterData(filter);
  };

  const completedTodos = completedTodoId(todos);

  const deleteMultiplyTodos = (deleteTodoIds: number[]) => {
    changeDeleteIds(deleteTodoIds);
    Promise.allSettled(deleteTodoIds.map(id => deleteTodos(id)));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodoCounter(todos)} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterName => (
          <a
            key={filterName}
            href="#/"
            className={classNames('filter__link', {
              selected: select === filterName,
            })}
            data-cy={classNames('FilterLink' + filterName)}
            onClick={() => handleClick(filterName)}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteMultiplyTodos(completedTodos)}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
