import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: Filters,
  setFilterBy: (item: Filters) => void,
  changeErrorMessage: (value: string) => void,
};

export const Footer: FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilterBy,
  changeErrorMessage,
}) => {
  const activeTodosLength = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasSomeTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    try {
      completedTodos.map(todo => deleteTodo(todo.id));
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      changeErrorMessage('Unable to delete todo');
    }
  };

  const filtersToMap = [Filters.All, Filters.Active, Filters.Completed];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filtersToMap.map((filterValue) => (
          <a
            key={filterValue}
            href={`#/${filterValue.toLowerCase()}`}
            className={`filter__link ${filter === filterValue ? 'selected' : ''}`}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilterBy(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasSomeTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
