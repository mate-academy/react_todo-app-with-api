import cn from 'classnames';
import { useContext, useMemo } from 'react';
import { TodosContext } from '../../TodosContext';
import { Error } from '../../types/Error';
import { Filter } from '../../types/Filter';

type Props = {
  todosCount: number;
  onFilter: (filterType: Filter) => void;
  filter: Filter;
};

export const TodosFooter: React.FC<Props> = (
  { todosCount, onFilter, filter },
) => {
  const {
    todos,
    deleteTodo,
    setUpdatingTodosId,
    setError,
  } = useContext(TodosContext);

  const isCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const countText = useMemo(() => {
    return todosCount > 1 ? 'items' : 'item';
  }, [todosCount]);

  const handleDeleteAllCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setUpdatingTodosId(completedTodosId);

    completedTodosId.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setUpdatingTodosId([]);
        })
        .catch(() => {
          setError(Error.Delete);
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosCount} ${countText} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === Filter.All })}
          onClick={() => onFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Filter.Active })}
          onClick={() => onFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.Comleted })}
          onClick={() => onFilter(Filter.Comleted)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isCompletedTodo}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
