import classNames from 'classnames';
import { Status } from '../../types/Status';
import { deleteTodo } from '../../api/todos';
import { errorType } from '../../types/ErrorType';
import { useTodoContext } from '../../context/TodoProvider';

export const Footer: React.FC = () => {
  const {
    focusInput,
    tasks,
    setTasks,
    completedTodos,
    setIsUpdating,
    setErrorMessage,
    setStatus,
    status,
  } = useTodoContext();
  const clearCompleted = async () => {
    let updateTasksIds: number[] | [] = [];

    await Promise.all(
      completedTodos.map(todo => {
        updateTasksIds = [...updateTasksIds, todo.id];
        setIsUpdating(updateTasksIds);
        deleteTodo(todo.id)
          .then(() => {
            setTasks(prevState => prevState.filter(el => el.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage(errorType.deleteTask);
            setIsUpdating([]);
          })
          .finally(() => {
            focusInput();
          });
      }),
    );
  };

  const taskLeft = tasks.length - completedTodos.length;

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {taskLeft} items left
        </span>
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: status === Status.all,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setStatus(Status.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: status === Status.active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setStatus(Status.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: status === Status.completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setStatus(Status.completed)}
          >
            Completed
          </a>
        </nav>
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => clearCompleted()}
          disabled={completedTodos.length === 0}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
