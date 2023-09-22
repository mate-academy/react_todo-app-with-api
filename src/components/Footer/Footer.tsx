import cn from 'classnames';
import { memo } from 'react';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  preparedTodos: Todo[],
  sort: SortType,
  setSort: React.Dispatch<React.SetStateAction<SortType>>,
  setOnChangeIds: React.Dispatch<React.SetStateAction<number[] | null>>,
  deleteTodo: (todoId: number) => Promise<void>,
};

export const Footer: React.FC<Props> = memo(({
  todos,
  preparedTodos,
  sort,
  setSort,
  setOnChangeIds,
  deleteTodo,
}) => {
  const handleClick = () => {
    const idsToDelete: number[] = [];

    preparedTodos.forEach(todo => {
      if (todo.completed) {
        idsToDelete.push(todo.id);
      }
    });

    setOnChangeIds([...idsToDelete]);
    idsToDelete.forEach(id => {
      deleteTodo(id)
        .finally(() => {
          setOnChangeIds(currentIds => {
            const filteredIds = currentIds?.filter(filteredId => (
              filteredId !== id
            ));

            if (!filteredIds) {
              return null;
            }

            return [...filteredIds];
          });
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: sort === SortType.ALL,
          })}
          onClick={() => setSort(SortType.ALL)}
        >
          {SortType.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: sort === SortType.ACTIVE,
          })}
          onClick={() => setSort(SortType.ACTIVE)}
        >
          {SortType.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: sort === SortType.COMPLETED,
          })}
          onClick={() => setSort(SortType.COMPLETED)}
        >
          {SortType.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !preparedTodos.some(todo => todo.completed),
        })}
        onClick={() => handleClick()}
      >
        Clear completed
      </button>
    </footer>
  );
});
