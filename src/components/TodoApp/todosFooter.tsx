import classNames from 'classnames';
import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[],
  setTodos : (todos: Todo[]) => void,
  filter: FilterType,
  setFilter: (type: FilterType) => void,
  onError: (error: ErrorType) => void,
  addTodoLoadId: (id: number) => void,
  setLoadingTodosId: (id: number[]) => void,
};

export const TodosFooter: React.FC<Props> = ({
  todos,
  filter: filterType,
  setFilter: setFilterType,
  onError: setErrorType,
  setTodos,
  addTodoLoadId,
  setLoadingTodosId,
}) => {
  const clearCompleted = () => {
    todos.map((item) => {
      if (item.completed) {
        addTodoLoadId(item.id);

        return (
          deleteTodo(item.id)
            .then(() => {
              setTodos(todos.filter((todo) => !todo.completed));
            })
            .catch(() => setErrorType(ErrorType.DELETE))
            .finally(() => setLoadingTodosId([]))
        );
      }

      return item;
    });
  };

  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.filter((todo) => !todo.completed).length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterType === FilterType.NONE,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.NONE);
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterType === FilterType.ACTIVE,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.ACTIVE);
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterType === FilterType.COMPLETED,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.COMPLETED);
              }}
            >
              Completed
            </a>
          </nav>

          {hasCompleted && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
