import React from 'react';
import { ERROR, FilterBy } from '../../types/enums';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterQwery: FilterBy;
  setFilterQwery: (qwery: FilterBy) => void;
  setErrorMessage: (value: ERROR) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  todosLoading: number[];
  loadingIdsState: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number | null) => void;
  };
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filterQwery,
  setFilterQwery,
  setErrorMessage,
  loadingIdsState,
}) => {
  const activeTodos = todos.filter(item => item.completed);
  const activeCount = todos.length - activeTodos.length || 0;
  const isSomeDone = todos.some(item => item.completed);
  const filterOptions: (keyof typeof FilterBy)[] = Object.keys(
    FilterBy,
  ) as (keyof typeof FilterBy)[];

  const filterChange = (input: FilterBy) => {
    const value = input;

    if (!value) {
      return;
    }

    setFilterQwery(value);
  };

  const onError = () => {
    setErrorMessage(ERROR.delete);
    loadingIdsState.removeIdFromLoadingList(null);
  };

  const deleteAllCompleted = () => {
    activeTodos.forEach(async item => {
      loadingIdsState.adIdToLoadingList(item.id);
      try {
        await deleteTodo(item.id);
        setTodos(prev => prev.filter(todo => todo.id !== item.id));
      } catch (error) {
        onError();
      } finally {
        loadingIdsState.removeIdFromLoadingList(item.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(item => {
          const filterValue = FilterBy[item];

          return (
            <a
              href="#/"
              key={item}
              className={cn('filter__link', {
                selected: filterQwery === filterValue,
              })}
              data-cy={filterValue}
              onClick={() => filterChange(filterValue)}
            >
              {item}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeDone}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
