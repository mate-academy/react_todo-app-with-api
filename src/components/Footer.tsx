import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setFiltredByStatus: (value: Status) => void;
  filtredByStatus: Status;
  setTodos: (value: Todo[]) => void;
  showErrorNotification: (value: string) => void;
  setProcesingTodoIds: React.Dispatch<React.SetStateAction<number[]>>; // !
};

export const Footer: React.FC<Props> = ({
  todos,
  setFiltredByStatus,
  filtredByStatus,
  setTodos,
  showErrorNotification,
  setProcesingTodoIds, // !
}) => {
  const itemsLeft = todos.filter((todo) => todo.completed === false).length;

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setProcesingTodoIds((prev: number[]) => [...prev, ...completedTodoIds]);

    const deletePromises = completedTodoIds.map((id) => {
      return new Promise((resolve) => {
        deleteTodo(id)
          .then(() => resolve(id))
          .catch(() => resolve(null));
      });
    });

    Promise.all(deletePromises)
      .then((successfulDeletions) => {
        const updatedTodos = todos.filter(
          (todo) => !completedTodoIds.includes(todo.id),
        );

        setTodos(updatedTodos);

        if (successfulDeletions.some((id) => id === null)) {
          showErrorNotification('Unable to delete a todo');
        }
      })
      .finally(() => {
        setProcesingTodoIds((prev) => prev
          .filter((id) => !completedTodoIds.includes(id)));
      });
  };

  //
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filtredByStatus === Status.all
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setFiltredByStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filtredByStatus === Status.active
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFiltredByStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filtredByStatus === Status.completed
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltredByStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed hidden"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some((tod) => tod.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
