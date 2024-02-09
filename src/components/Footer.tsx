import { useContext } from 'react';

import { TodosFilter } from './TodoFilter';

import { TodoContext } from './TodosContext';
import { Status } from '../types/Status';

export const Footer: React.FC = () => {
  const { todos, handlerDeleteCompleted } = useContext(TodoContext);
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <TodosFilter filter={Status.ALL} setFilter={() => {}} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handlerDeleteCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>

    </footer>
  );
};
