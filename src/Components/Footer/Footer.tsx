import React, { useContext, useMemo } from 'react';
import cn from 'classnames';
import { TodosContext } from '../Store/Store';
import { FilterParams } from '../../Types/FilterParams';
import { client } from '../../utils/fetchClient';

export const Footer: React.FC = React.memo(() => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    setErrorMessage,
    addProcessing,
    removeProcessing,
    focus,
  } = useContext(TodosContext);

  const itemsLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = async () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo => addProcessing(todo.id));
    // completedTodos.forEach(async todo => {
    //   try {
    //     await client.delete(`/${todo.id}`);
    //     setTodos(current => current.filter(upTodo => !upTodo.completed));
    //     // setTodos(todos.filter(upTodo => !upTodo.completed));
    //   } catch {
    //     setErrorMessage('Unable to delete a todo');
    //   } finally {
    //     completedTodos.map(upTodo => removeProcessing(upTodo.id));
    //     focus.current?.focus();
    //   }
    // });
    try {
      await Promise.all(
        completedTodos.map(todo => client.delete(`/${todo.id}`)),
      );

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      completedTodos.map(todo => removeProcessing(todo.id));
      focus.current?.focus();
    }
    // try {
    //   await Promise.allSettled(
    //     completedTodos.map(todo => client.delete(`/${todo.id}`)),
    //   );

    //   // setTodos(todos.filter(todo => !todo.completed));
    //   setTodos(current => current.filter(upTodo => !upTodo.completed));
    // } catch {
    //   setErrorMessage('Unable to delete a todo');
    // } finally {
    //   completedTodos.map(todo => removeProcessing(todo.id));
    //   focus.current?.focus();
    // }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterParams.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterParams.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterParams.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterParams.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterParams.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterParams.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
