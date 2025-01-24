import { Status } from '../../types/Status';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  handleErrorNotification,
  removeTodo,
  setLoadingTodos,
  setStatus,
} from '../../features/todosSlice';

export const Footer: React.FC = () => {
  const todos = useAppSelector(state => state.todos.items);
  const status = useAppSelector(state => state.todos.status);
  const dispatch = useAppDispatch();

  const activeList = todos.filter(todo => !todo.completed);
  const completedList = todos.filter(todo => todo.completed);

  const shouldDisable = completedList.length ? false : true;

  const clearCompletedFromServer = () => {
    return completedList.forEach(todo => {
      dispatch(setLoadingTodos(todo.id));
      dispatch(removeTodo(todo));
      setTimeout(() => dispatch(handleErrorNotification('')), 3000);
    });
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeList.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(statusValue => (
          <a
            key={statusValue}
            href="#/"
            className={
              'filter__link ' + (status === statusValue ? 'selected' : '')
            }
            data-cy={
              'FilterLink' +
              statusValue.charAt(0).toUpperCase() +
              statusValue.slice(1)
            }
            onClick={() => dispatch(setStatus(statusValue))}
          >
            {statusValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={shouldDisable}
        onClick={clearCompletedFromServer}
      >
        Clear completed
      </button>
    </footer>
  );
};
