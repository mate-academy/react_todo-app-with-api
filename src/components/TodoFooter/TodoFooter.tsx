import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';
import { FilterParams } from '../../types/FilterParams';
import { ErrorMessages } from '../../types/ErrorMessages';

import { UseTodosContext } from '../../utils/TodosContext';

export const TodoFooter = () => {
  const context = UseTodosContext();

  const {
    todos,
    setTodos,
    filterParam,
    setFilterParam,
    setLoadingTodos,
    setErrorMessage,
  } = context;

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const isSomeTodoCompleted = todos.some(({ completed }) => completed);

  const handleCompletedTodosClear = async () => {
    const todosToBeChanged = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);
    const requests = todosToBeChanged
      .map(id => deleteTodo(id));

    try {
      setLoadingTodos(todosToBeChanged);
      await Promise.all(requests);

      setTodos(prevState => prevState.filter(({ completed }) => !completed));
    } catch (error) {
      setErrorMessage(ErrorMessages.CannotUpdate);
    }
  };

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav data-cy="Filter" className="filter">
        {Object.values(FilterParams).map(value => (
          <a
            data-cy={`FilterLink${value}`}
            href={`#/${value}`}
            key={value}
            className={classNames('filter__link', {
              selected: value === filterParam,
            })}
            onClick={() => setFilterParam(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isSomeTodoCompleted}
        onClick={handleCompletedTodosClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
