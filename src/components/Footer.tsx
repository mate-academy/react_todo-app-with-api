import cn from 'classnames';
import { FilterStatus, Todo } from '../types/Types';
import { deleteTodos } from '../api/todos';
import { showError } from '../helpers/helpers';

interface Props {
  filter: string,
  todos: Todo[]
  setFilter: (text: FilterStatus) => void;
  setTodos: (todos: Todo[]) => void;
  setError: React.Dispatch<React.SetStateAction<string>>
  setLoader: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: React.FC<Props> = ({
  filter,
  todos,
  setFilter,
  setTodos,
  setError,
  setLoader,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const isClearButtonIsVisible = todos.some(todo => todo.completed);
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);

    completedTodos.map(todo => {
      setLoader(prevState => [...prevState, todo.id]);

      return deleteTodos(todo.id);
    });
    try {
      await Promise.all(completedTodos);
      setTodos(activeTodos);
      setLoader([]);
    } catch (error) {
      showError('Unable to delete a todo', setError);
      setLoader([]);
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterStatus.ALL,
          })}
          onClick={() => setFilter(FilterStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.ACTIVE,
          })}
          onClick={() => setFilter(FilterStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterStatus.COMPLETED,
          })}
          onClick={() => setFilter(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        style={{ visibility: isClearButtonIsVisible ? 'visible' : 'hidden' }}
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
