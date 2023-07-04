import cn from 'classnames';
import { FC } from 'react';
import { FilterType } from '../Enums/FilterType';
import { Todo } from '../types/Todo';
import { TodosFilter } from './TodosFilter';
// import { getCompletedTodos } from '../utils/getCompletedTodos';
import { getNotCompletedTodosAmmount } from '../utils/getNotCompletedTodos';

interface Props {
  todos: Todo[],
  filterType: FilterType,
  setFilterType:React.Dispatch<React.SetStateAction<FilterType>>,
  // removeTodosByID: (todoID: number) => Promise<void>
}

export const Footer:FC<Props> = ({
  todos,
  setFilterType,
  filterType,
  // removeTodosByID,
}) => {
  // const completedTodosIds = useMemo(() => (
  //   getCompletedTodos(todos).map(todo => todo.id)
  // ), [todos]);

  // const handleRemoveTodosById = useCallback(() => {
  //   removeTodosByID(completedTodosIds);
  // }, [completedTodosIds, removeTodosByID]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${getNotCompletedTodosAmmount(todos)} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <TodosFilter
        setFilterType={setFilterType}
        currentFilterType={filterType}
      />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          // hidden: completedTodosIds.length === 0,
        })}
        // onClick={handleRemoveTodosById}
      >
        Clear completed
      </button>
    </footer>
  );
};
