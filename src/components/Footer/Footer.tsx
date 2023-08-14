import { FC } from 'react';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { useTodosContext } from '../../context/useTodosContext';

export const Footer:FC = () => {
  const {
    todos,
    setTodos,
    setVisibleTodos,
    setErrorMessage,
    filter,
    setFilter,
    setIsLoadingCompleted,
  } = useTodosContext();

  const clearCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const deletedTodos = completedTodos
        .map(todo => deleteTodo(todo.id, setTodos, setErrorMessage));

      setIsLoadingCompleted(true);
      await Promise.all(deletedTodos);
      setVisibleTodos(todos.filter(todo => !todo.completed));
      setIsLoadingCompleted(false);
    } catch (error) {
      setErrorMessage('Unable to delete completed todos');
      throw new Error('Error');
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === '' },
          )}
          onClick={() => setFilter('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === 'Active' },
          )}
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === 'Completed' },
          )}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {todos.filter(todo => todo.completed).length !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
