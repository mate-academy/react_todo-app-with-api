import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { getTodos, removeTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { ErrorStatus } from '../types/ErrorStatus';

interface Props {
  filterType: Filter;
  setFilterType: (type: Filter) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoFooter: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
  setTodos,
  setErrorMessage,
  setLoadingIds,
}) => {
  const completedTodoCount = todos.filter(todo => todo.completed).length;
  const uncompletedTodoCount = todos.filter(todo => !todo.completed).length;

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setLoadingIds(currIds => [...currIds, ...completedTodosIds]);

    Promise.all(completedTodos.map(todo => {
      return removeTodo(todo.id);
    }))
      .then(() => {
        getTodos(USER_ID)
          .then((data) => {
            setTodos(data);
            setLoadingIds([]);
          })
          .catch(() => {
            setErrorMessage(ErrorStatus.Load);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Delete);
      });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodoCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === Filter.All,
          })}
          onClick={() => setFilterType(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filter.Active,
          })}
          onClick={() => setFilterType(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          onClick={() => setFilterType(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': completedTodoCount === 0 })}
        onClick={() => {
          deleteCompletedTodos();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
