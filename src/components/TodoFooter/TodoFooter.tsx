import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { Status } from '../../types/Status';
import { TodoContext } from '../TodoContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../ErrorContext';
import { TodoLoader } from '../../types/TodoLoader';

type Props = {
  status: Status;
  onStatusChange: (status: Status) => void;
  onGlobalLoaderChange: (globalLoader: TodoLoader) => void;
};

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    status,
    onStatusChange,
    onGlobalLoaderChange,
  } = props;

  const { todos, setTodos } = useContext(TodoContext);
  const { setError } = useContext(ErrorContext);

  const uncomplitedTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const addSToItem = useMemo(
    () => (uncomplitedTodos.length === 1 ? '' : 's'),
    [uncomplitedTodos.length],
  );

  const handleComplDelete = () => {
    onGlobalLoaderChange(TodoLoader.Completed);

    const deletedTodos: Promise<number>[] = [];

    todos.forEach(({ id, completed }) => {
      if (completed) {
        deletedTodos.push(deleteTodo(id)
          .then(() => id)
          .catch(error => {
            throw error;
          }));
      }
    });

    Promise.all(deletedTodos)
      .then((res) => {
        setTodos(prevState => prevState
          .filter(todo => !res.includes(todo.id)));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => onGlobalLoaderChange(TodoLoader.None));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncomplitedTodos.length} item${addSToItem} left`}
      </span>

      <nav className="filter">
        {Object.entries(Status).map(([key, value]) => {
          return (
            <a
              key={key}
              href={`#/${value}`}
              className={classNames('filter__link', {
                selected: value === status,
              })}
              onClick={() => onStatusChange(value)}
            >
              {key}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={uncomplitedTodos.length === todos.length}
        onClick={handleComplDelete}
      >
        Clear completed
      </button>

    </footer>
  );
};
