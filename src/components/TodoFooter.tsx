import cn from 'classnames';
import { useTodos } from '../context/TodosProvider';
import { FilterBy } from '../types/filter';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from '../types/Errors';
import { Todo } from '../types/Todo';

export const TodoFooter: React.FC = () => {
  const {
    filter,
    setFilter,
    counter,
    todos,
    setTodos,
    setErrorMessage,
  } = useTodos();

  const isSomeTodosCompleted = todos.some((todo) => todo.completed);

  const clearCompleted = () => {
    const completedTodos = todos.filter((todoToFind) => todoToFind.completed);

    const toDelete: Todo[] = [];

    completedTodos.map((completedTodo) => deleteTodos(completedTodo.id)
      .then(() => toDelete.push(completedTodo))
      .catch(() => setErrorMessage(ErrorMessage.Delete)));

    setTimeout(() => {
      const filtered = todos.filter(
        (todoToFilter) => !toDelete.includes(todoToFilter),
      );

      setTodos(filtered);
    }, 500);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(filter === FilterBy.All
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(filter === FilterBy.Active
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(filter === FilterBy.Completed
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          disabled: !isSomeTodosCompleted,
        })}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!isSomeTodosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
