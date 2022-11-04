import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { deleteTodo } from '../../api/todos';

type Props = {
  getFilteredBy: (param: FilterType) => void;
  selectedButtonType: FilterType;
  completedTodos: Todo[];
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (text: string) => void;
};

export const Footer: React.FC<Props> = ({
  getFilteredBy,
  selectedButtonType,
  setTodos,
  todos,
  setErrorMessage,
  completedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  const deleteCompletedTodos = async (completed: Todo[]) => {
    try {
      completed.map(async (todo) => {
        await deleteTodo(todo.id);

        setTodos([...activeTodos]);
      });
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const clearAllTodos = async (allTodos: Todo[]) => {
    getFilteredBy(FilterType.All)
    try {
      allTodos.map(async (todo) => {
        await deleteTodo(todo.id);
        setTodos([]);
      });
    } catch (error) {
      setErrorMessage(
        'Sorry, but you can\'t clear all todos now, try later please)',
      );
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedButtonType === FilterType.All },
          )}
          onClick={() => getFilteredBy(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedButtonType === FilterType.Active },
          )}
          onClick={() => getFilteredBy(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedButtonType === FilterType.Completed },
          )}
          onClick={() => getFilteredBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.length > 0
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => clearAllTodos(todos)}
          >
            Clear All
          </button>
        )}

      {completedTodos.length > 0
        && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={() => deleteCompletedTodos(completedTodos)}
          >
            Clear completed
          </button>
        )}
    </footer>
  );
};
