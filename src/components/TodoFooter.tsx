import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';
import { FilteredTodos } from '../enums/FilteredTodos';

interface Props {
  setFilterSelected: (filterSelected: FilteredTodos) => void;
  filterSelected: FilteredTodos;
  activeTodos: Todo[];
  completedTodos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  setLoadingTodosIds: (todos: number[]) => void;
}

export const TodoFooter: React.FC<Props> = ({
  setFilterSelected,
  filterSelected,
  activeTodos,
  completedTodos,
  deleteTodo,
  setLoadingTodosIds,
}) => {
  const handleDeleteCompletedTodos = () => {
    setLoadingTodosIds(completedTodos.map(todo => todo.id));

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id))).finally(() => {
      setLoadingTodosIds([]);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter
        setFilterSelected={setFilterSelected}
        filterSelected={filterSelected}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
