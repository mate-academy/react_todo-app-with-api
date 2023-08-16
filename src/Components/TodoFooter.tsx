import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { getTodos, deleteTodo } from '../api/todos';
import { Notification } from '../types/Notification';
import { USER_ID } from '../utils/constants';
import { Filter } from '../types/Filter';

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
      return deleteTodo(todo.id);
    }))
      .then(() => {
        getTodos(USER_ID)
          .then((data) => {
            setTodos(data);
            setLoadingIds([]);
          })
          .catch(() => {
            setErrorMessage(Notification.load);
          });
      })
      .catch(() => {
        setErrorMessage(Notification.delete);
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
            selected: filterType === Filter.ALL,
          })}
          onClick={() => setFilterType(Filter.ALL)}
        >
          {Filter.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filter.ACTIVE,
          })}
          onClick={() => setFilterType(Filter.ACTIVE)}
        >
          {Filter.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filter.COMPLETED,
          })}
          onClick={() => setFilterType(Filter.COMPLETED)}
        >
          {Filter.COMPLETED}
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
