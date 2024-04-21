import { useContext } from 'react';
import { FilterContainer } from './components/Filter/Filter';
import { todosContext } from '../../Store';
import { items } from '../../utils/utils';

export const Footer: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const completedTodos = items.completed(state.todos);
  const todosCount = state.todos.length - completedTodos.length;
  const findCompletedTodos = completedTodos.length > 0;

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
        disabled={!findCompletedTodos}
        onClick={() => items.clearCompleted(state.todos, setters)}
      >
        Clear completed
      </button>
    </footer>
  );
};
