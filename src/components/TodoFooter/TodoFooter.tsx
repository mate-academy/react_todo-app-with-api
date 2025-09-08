import * as React from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../utils/constants';

type TodoFooterProps = {
  todos: Todo[];
  status: TodoStatus;
  setStatus: (status: TodoStatus) => void;
  onDeleteTodo: (id: number) => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  status,
  setStatus,
  onDeleteTodo: handleDeleteTodo,
}) => {
  const completedIds = todos.filter(t => t.completed).map(t => t.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(t => !t.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={`filter__link ${status === TodoStatus.All ? 'selected' : ''}`}
          onClick={() => setStatus(TodoStatus.All)}
        >
          {TodoStatus.All}
        </a>
        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={`filter__link ${status === TodoStatus.Active ? 'selected' : ''}`}
          onClick={() => setStatus(TodoStatus.Active)}
        >
          {TodoStatus.Active}
        </a>
        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={`filter__link ${status === TodoStatus.Completed ? 'selected' : ''}`}
          onClick={() => setStatus(TodoStatus.Completed)}
        >
          {TodoStatus.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedIds.length === 0}
        onClick={() => completedIds.forEach(id => handleDeleteTodo(id))}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
