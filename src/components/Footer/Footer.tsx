import { useContext } from 'react';
import { FilterContainer } from './components/Filter/Filter';
import { todosContext } from '../../Store';
import { completedTodos } from '../../utils/utils';
import { handleDelete } from '../../utils/handleDelete';
import { TodoWithLoader } from '../../types/TodoWithLoader';

export const Footer: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const todosCount = state.todos.length - completedTodos(state.todos).length;
  const findCompletedTodos = completedTodos(state.todos).length > 0;

  function clearCompletedTodos(completedTodos1: TodoWithLoader[]) {
    completedTodos1.map(todo => {
      handleDelete(todo, setters);
    });
  }

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
        onClick={() => clearCompletedTodos(completedTodos(state.todos))}
      >
        Clear completed
      </button>
    </footer>
  );
};
