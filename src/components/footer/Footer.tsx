import { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { ActionState } from '../../helpers/helpers';
import { Todo } from '../../types/Todo';

type Props = {
  onDelete: (val: number) => void,
};

export const Footer: React.FC<Props> = ({ onDelete }) => {
  const {
    todos,
    filterTodos,
    setFilterTodos,
  } = useContext(TodosContext);

  function countItems() {
    const totalAmount = todos.filter((todo: Todo) => !todo.completed);

    return totalAmount.length;
  }

  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    const result = completedTodos.map((t) => onDelete(t.id));

    Promise.all(result);
  };

  const isButtonVisible = (todos.some((todo) => todo.completed));

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countItems()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={filterTodos === ActionState.ALL
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => setFilterTodos(ActionState.ALL)}
        >
          {ActionState.ALL}
        </a>

        <a
          href="#/active"
          className={filterTodos === ActionState.ACTIVE
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => setFilterTodos(ActionState.ACTIVE)}
        >
          {ActionState.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={filterTodos === ActionState.COMPLETED
            ? 'filter__link selected'
            : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterTodos(ActionState.COMPLETED)}
        >
          {ActionState.COMPLETED}
        </a>
      </nav>

      <button
        style={{ visibility: isButtonVisible ? 'visible' : 'hidden' }}
        type="button"
        disabled={todos.every((todo) => !todo.completed)}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
