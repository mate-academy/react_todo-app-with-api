import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { FooterNav } from '../FooterNav/FooterNav';

type Props = {
  todos: Todo[];
  clearCompleted: () => void;
  changeFilter: (newFilter: FilterType) => void;
  filter: FilterType;
};

export const Footer = ({
  todos,
  clearCompleted,
  changeFilter,
  filter,
}: Props) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeCount} items left`}
        </span>

        <FooterNav changeFilter={changeFilter} filter={filter} />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
          disabled={!todos.some(todo => todo.completed)}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
