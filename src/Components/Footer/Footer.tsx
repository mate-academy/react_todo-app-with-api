import classNames from 'classnames';
import { Errors, FilterBy } from '../../utils/enum';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  filteredBy: string;
  todosLength: number;
  handleChangeFilterType: (filterBy: string) => void;
  todos: Todo[];
  setTodoList: (todos: Todo[]) => void;
  setErrorMessage: (errorMessage: string) => void;
  setLoadingTodos: (deletedTodos: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  filteredBy,
  todosLength,
  handleChangeFilterType,
  todos,
  setTodoList,
  setErrorMessage,
  setLoadingTodos,
}) => {
  const handleDeleteAllCompletedTodo = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    const completedTodosID = completedTodos.map((todo) => todo.id);
    const incompletedTodos = todos.filter((todo) => !todo.completed);

    completedTodos.forEach(async (todo) => {
      try {
        setLoadingTodos([...completedTodosID]);

        await deleteTodo(todo.id);

        setTodoList(incompletedTodos);
      } catch {
        setErrorMessage(Errors.Delete);
      } finally {
        setLoadingTodos([]);
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todosLength} items left`}</span>

      <nav className="filter">
        {Object.keys(FilterBy).map((key) => (
          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filteredBy === key,
            })}
            key={key}
            onClick={() => handleChangeFilterType(key)}
          >
            {key}
          </a>
        ))}
      </nav>

      {todos.some((todo) => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleDeleteAllCompletedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
