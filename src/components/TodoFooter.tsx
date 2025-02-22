import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  setLoading: (value: boolean) => void;
  setActiveTodos: (todo: Todo[]) => void;
  setTodos: (todos: Todo[]) => void;
  setTodoList: (filteredTodos: Todo[]) => void;
  onDelete: (todoId: number) => void;
  errorFunction: (message: string) => void;
  loadingState: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setActiveTodos,
  setLoading,
  setTodos,
  setTodoList,
  errorFunction = () => {},
  loadingState,
}) => {
  const [filterType, setFilterType] = useState<Filter>(Filter.All);

  const filteredTodosList = useCallback(
    (todosType: Filter): Todo[] => {
      const value = todosType === Filter.Active ? false : true;

      return todos.filter(todo => todo.completed === value);
    },
    [todos],
  );

  const clearFunction = async (completed: Todo[]) => {
    const successesDeletes: number[] = [];

    setActiveTodos([...completed]);

    for (const completedTodo of completed) {
      try {
        await deleteTodo(completedTodo.id);
        successesDeletes.push(completedTodo.id);
      } catch {
        errorFunction('Unable to delete a todo');
      }
    }

    return successesDeletes;
  };

  const handleClear = () => {
    const completedTodos = filteredTodosList(Filter.Completed);

    setLoading(true);

    return clearFunction(completedTodos)
      .then(successesDeletes =>
        setTodos(todos.filter(todo => !successesDeletes.includes(todo.id))),
      )
      .finally(() => setLoading(false));
  };

  const filterFunction = (filter: Filter) => {
    switch (filter) {
      case Filter.All:
        setTodoList(todos);
        break;

      case Filter.Active:
        setTodoList(todos.filter(todo => !todo.completed));
        break;

      case Filter.Completed:
        setTodoList(todos.filter(todo => todo.completed));
        break;

      default:
        setTodos(todos);
    }
  };

  const setFilter = (filter: Filter) => {
    setFilterType(filter);

    return filterFunction(filter);
  };

  useEffect(() => {
    if (filterType) {
      filterFunction(filterType);
    }
  }, [todos]);

  const findFilterKey = (value: string): string | undefined => {
    return Object.keys(Filter).find(
      key => Filter[key as keyof typeof Filter] === value,
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {filteredTodosList(Filter.Active).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: filterType === filter,
            })}
            onClick={() => setFilter(filter)}
            data-cy={`FilterLink${findFilterKey(filter)}`}
          >
            {findFilterKey(filter)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClear()}
        disabled={
          filteredTodosList(Filter.Completed).length === 0 || loadingState
        }
      >
        Clear completed
      </button>
    </footer>
  );
};
