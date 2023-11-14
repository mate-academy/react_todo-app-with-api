import React, { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Error } from '../../types/Error';
import { StateContext, DispatchContext } from '../../Context/Store';
import { deleteTodo } from '../../api/todos';

type Props = {
  setFilter: (value: Filter) => void;
  filter: Filter;
};

export const TodoFooter: React.FC<Props> = ({
  setFilter,
  filter,
}) => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const countLeft = todos.filter(todo => !todo.completed).length;

  const haveCompleted = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletedPromises = completedTodos
      .map(todo => deleteTodo(todo.id).then(() => dispatch({
        type: 'deleteTodo',
        payload: todo,
      })));

    Promise.all(deletedPromises)
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableDeleteTodo,
      }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            href={`#/${value.toLowerCase()}`}
            className={cn('filter__link',
              { selected: filter === value })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilter(value)}
          >
            {value}
          </a>
        ))}
        {/* <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a> */}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!haveCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
