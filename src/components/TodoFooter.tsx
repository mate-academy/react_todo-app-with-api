import { Todo } from '../types/Todo';
import { Filter } from '../types/Filters';
import { TodoFilter } from './TodoFilter';

type TodoFooterProps = {
  counter: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todos: Todo[];
  handleDelete: (todo: Todo) => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  counter,
  filter,
  setFilter,
  todos,
  handleDelete,
}) => {
  const handleClearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        handleDelete(todo);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter === 1 ? '1 item left' : `${counter} items left`}
      </span>
      <TodoFilter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some((todo) => todo.completed === true)}
      >
        Clear completed
      </button>
    </footer>
  );
};
