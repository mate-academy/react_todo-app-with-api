import { useContext } from 'react';
import { FilterContainer } from './components/Filter/Filter';
import { todosContext } from '../../Store';
import { items } from '../../utils/utils';

export const Footer: React.FC = () => {
  const [{ todos }, setters] = useContext(todosContext);
  const completedTodos = items.completed(todos);
  const todosCount = items.uncompleted(todos).length;
  const isDisabled = completedTodos.length === 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <FilterContainer />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabled}
        onClick={() => items.clearCompleted(todos, setters)}
      >
        Clear completed
      </button>
    </footer>
  );
};
