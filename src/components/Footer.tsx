import cn from 'classnames';
import { FC, useCallback, useMemo } from 'react';
import { FilterType } from '../Enums/FilterType';
import { Todo } from '../types/Todo';
import { TodosFilter } from './TodosFilter';
import { getCompletedTodos } from '../utils/getCompletedTodos';
import { getNotCompletedTodosAmmount } from '../utils/getNotCompletedTodos';

interface Props {
  todos: Todo[],
  filterType: FilterType,
  setFilterType:React.Dispatch<React.SetStateAction<FilterType>>,
  removeTodoByID: (todoID: number) => Promise<boolean>
  setCurrentlyLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>
}

export const Footer:FC<Props> = ({
  todos,
  setFilterType,
  filterType,
  removeTodoByID,
  setCurrentlyLoadingTodos,
}) => {
  const completedTodosIds = useMemo(() => (
    getCompletedTodos(todos).map(todo => todo.id)
  ), [todos]);

  const handleremoveTodosByID = useCallback(async () => {
    setCurrentlyLoadingTodos(completedTodosIds);

    await Promise.all(
      completedTodosIds.map((todoId) => (
        removeTodoByID(todoId)
      )),
    );

    setCurrentlyLoadingTodos([]);
  }, [completedTodosIds, removeTodoByID, setCurrentlyLoadingTodos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${getNotCompletedTodosAmmount(todos)} items left`}
      </span>

      <TodosFilter
        setFilterType={setFilterType}
        currentFilterType={filterType}
      />

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: completedTodosIds.length === 0,
        })}
        onClick={handleremoveTodosByID}
      >
        Clear completed
      </button>
    </footer>
  );
};
