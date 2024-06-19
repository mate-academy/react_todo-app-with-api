import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { useTodoContext } from './GlobalProvider';

export const Footer: React.FC = () => {
  const {
    todos,
    setClearCompleted,
    setTodos,
    setErrorMessage,
    inputRef,
    filteredButton,
    setFilteredButton,
  } = useTodoContext();

  const completedTodos = todos.filter(todo => todo.completed);
  const todosLeft = todos.length - completedTodos.length;

  const onDelete = (id: number) => {
    setClearCompleted(true);
    deleteTodo(id)
      .then(() => {
        setTodos(todoState => todoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setClearCompleted(false);
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => onDelete(todo.id));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteredButton === 'all',
          })}
          onClick={() => setFilteredButton('all')}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteredButton === 'active',
          })}
          onClick={() => setFilteredButton('active')}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteredButton === 'completed',
          })}
          onClick={() => setFilteredButton('completed')}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
