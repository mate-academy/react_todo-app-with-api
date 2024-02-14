import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { ContextTodo } from '../ContextTodo';
import { TodoFilter, ErrorMessage } from '../../types';
import { deleteTodo } from '../../api/todos';

export const FooterTodo = () => {
  const {
    filterBy,
    setFilterBy,
    todos,
    setTodos,
    setLoadingTodoIds,
    setErrorMessage,
  } = useContext(ContextTodo);

  const toDeleteTodosId = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const removeCompletedTodos = () => {
    setLoadingTodoIds(toDeleteTodosId);

    toDeleteTodosId.map(deletedTodoId => deleteTodo(deletedTodoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodoId)))
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodoError))
      .finally(() => setLoadingTodoIds([])));
  };

  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => setFilterBy(TodoFilter.All)}
          className={classNames('filter__link', {
            selected: filterBy === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilterBy(TodoFilter.Active)}
          className={classNames('filter__link', {
            selected: filterBy === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilterBy(TodoFilter.Completed)}
          className={classNames('filter__link', {
            selected: filterBy === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        onClick={removeCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
