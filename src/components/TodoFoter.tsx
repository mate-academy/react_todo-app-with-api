import cn from 'classnames';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  onChangeFilter: (v: Status) => void,
  filteredSelected: Status,
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
};

const filterOptions = [
  { type: Status.ALL, value: 'All' },
  { type: Status.ACTIVE, value: 'Active' },
  { type: Status.COMPLETED, value: 'Completed' },
];

export const TodoFooter: React.FC<Props> = ({
  onChangeFilter,
  filteredSelected,
  todos,
  onDeleteTodo,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.some(todo => todo.completed);

  const deleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDeleteTodo(todo.id);
    });
  };

  const handleSelected = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    type: Status,
  ) => {
    event.preventDefault();
    onChangeFilter(type);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {filterOptions.map(({ type, value }) => (
          <a
            key={type}
            href={`#/${type.toLowerCase()}`}
            className={`filter__link ${cn({
              selected: filteredSelected === type,
            })}`}
            onClick={(event) => handleSelected(event, type)}
          >
            {value}
          </a>
        ))}
      </nav>

      {completedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
