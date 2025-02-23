import { useMemo } from 'react';
import { TodoInterface } from '../../types/Todo';
import cn from 'classnames';
import { Filter } from '../../types/filter';

interface Props {
  todos: TodoInterface[];
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  filter: string;
  deleteTodos: (content: number[]) => Promise<void>;
  setTodosForModify: React.Dispatch<React.SetStateAction<TodoInterface[]>>;
}

export const FilteredTodoList: React.FC<Props> = ({
  todos,

  filter,
  setFilter,

  deleteTodos,

  setTodosForModify,
}) => {
  const countNotCompletedItem = useMemo(() => {
    const filtered = todos.filter(todo => !todo.completed);

    return filtered.length;
  }, [todos]);

  const handledeleteTodos = () => {
    setTodosForModify(() => {
      return todos.filter(todo => todo.completed);
    });

    const content = todos.filter(todo => todo.completed).map(todo => todo.id);

    deleteTodos(content);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countNotCompletedItem} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.values(Filter) as Filter[]).map(way => (
          <a
            key={way}
            href="#/"
            className={cn('filter__link', { selected: filter === way })}
            data-cy={`FilterLink${way}`}
            onClick={() => {
              setFilter(way);
            }}
          >
            {way}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handledeleteTodos}
        disabled={todos.length - countNotCompletedItem === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
