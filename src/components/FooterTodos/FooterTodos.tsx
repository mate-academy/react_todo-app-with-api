import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type FooterTodosProps = {
  todos: Todo[];
  filter: (typeOfSort: Filter) => void;
  clearCompleted: () => void;
  selected: Filter;
};

export const FooterTodos: React.FC<FooterTodosProps> = ({
  todos,
  filter,
  clearCompleted,
  selected,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const todosLeft = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(type => (
          <a
            key={type}
            href={`#/${type.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: selected === type,
            })}
            data-cy={`FilterLink${type}`}
            onClick={() => filter(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
