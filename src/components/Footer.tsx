// import { deleteTodo } from '../api/todos';
import { SortBy, Todo } from '../types';

type Props = {
  todosNotCompleted: number,
  handleSetSortBy: (value:SortBy) => void,
  sortBy: SortBy,
  todos: Todo[],
  handleDeleteTodo: (value: number) => void,
  handleSelectedTodo: (todoID: number[]) => void;
  selectedTodo: number[];
};

export const Footer: React.FC<Props> = ({
  todosNotCompleted,
  handleSetSortBy,
  sortBy,
  todos,
  handleDeleteTodo,
  handleSelectedTodo,
  selectedTodo,
}) => {
  const deleteCompletedtodo = () => {
    try {
      todos.forEach(async todo => {
        if (todo.completed === true) {
          handleSelectedTodo([...selectedTodo, todo.id]);
        }
      });
    } finally {
      handleSelectedTodo([]);
    }

    todos.forEach(todo => {
      if (todo.completed === true) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosNotCompleted} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={sortBy === 'all'
            ? 'filter__link selected'
            : 'filter__link'}
          onClick={() => handleSetSortBy(SortBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={sortBy === 'active'
            ? 'filter__link selected'
            : 'filter__link'}
          onClick={() => handleSetSortBy(SortBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={sortBy === 'completed'
            ? 'filter__link selected'
            : 'filter__link'}
          onClick={() => handleSetSortBy(SortBy.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={todosNotCompleted === todos.length}
        onClick={() => {
          deleteCompletedtodo();
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
