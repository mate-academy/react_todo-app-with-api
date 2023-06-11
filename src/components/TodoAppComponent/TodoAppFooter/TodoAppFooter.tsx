import { TodoFilter } from './TodoFilter';
import { useTodosContext } from '../../../Context/TodosContext';

export const TodoAppFooter = () => {
  const { todos, handleDeleteCompleted } = useTodosContext();

  const numberItems = todos.filter(todo => !todo.completed).length;
  const isButtonCompleted = todos.length !== numberItems;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberItems} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleDeleteCompleted}
        style={{ visibility: isButtonCompleted ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>

    </footer>
  );
};
