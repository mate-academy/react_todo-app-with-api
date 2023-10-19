import { Todo } from '../types/Todo';
import { StatusFilter } from '../services/EnumStatusFilter';

type Props = {
  todos: Todo[],
  countTodos: number,
  selectTodoFilteredList: StatusFilter,
  setSelectTodoFilteredList: (s: StatusFilter) => void,
  removeCompletedTodos: (ids: number[]) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  countTodos,
  selectTodoFilteredList,
  setSelectTodoFilteredList,
  removeCompletedTodos,
}) => {
  const handleRemoveCompletedTodos = (ids: number[]) => {
    removeCompletedTodos(ids);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={selectTodoFilteredList === StatusFilter.ALL
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={selectTodoFilteredList === StatusFilter.ACTIVE
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={selectTodoFilteredList === StatusFilter.COMPLETED
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setSelectTodoFilteredList(StatusFilter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          handleRemoveCompletedTodos(todos.filter(
            (todo) => todo.completed === true,
          ).map((todo) => todo.id));
        }}
        disabled={!todos.some((todo) => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
