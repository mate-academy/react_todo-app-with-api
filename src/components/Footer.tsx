import cn from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import { ErrorMessage, FilterBy } from '../types';
import { deleteTodo } from '../api/todos';
import { SetErrorMessageContext, TodosContext } from '../contexts';

type Props = {
  filterBy: string;
  handleFilterClick: (e: React.MouseEvent) => void;
};

export const Footer: React.FC<Props> = ({ filterBy, handleFilterClick }) => {
  const { todosContext, setTodosContext } = useContext(TodosContext);
  const setErrorMessage = useContext(SetErrorMessageContext);

  const { todos, inputFieldRef } = todosContext;

  const itemsLeftAmount = useMemo(() => {
    return todos.reduce((res, todo) => {
      return todo.completed ? res : res + 1;
    }, 0);
  }, [todos]);

  const handleClearCompletedClick = useCallback(() => {
    setTodosContext(prevTodosContext => ({
      ...prevTodosContext,
      isDeletingCompleted: true,
    }));
    setErrorMessage(ErrorMessage.noError);

    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          return todo.id;
        } catch {
          setErrorMessage(ErrorMessage.delete);
          throw new Error();
        }
      }),
    )
      .then(results => {
        setTodosContext(prevTodosContext => {
          const fulfilledIds = results
            .map(result => {
              if (result.status === 'fulfilled') {
                return result.value;
              }

              return null;
            })
            .filter(result => result !== null);

          return {
            ...prevTodosContext,
            todos: todos.filter(todo => {
              return !fulfilledIds.includes(todo.id);
            }),
          };
        });
      })
      .finally(() => {
        if (inputFieldRef?.current) {
          inputFieldRef.current.focus();
        }

        setTodosContext(prevTodosContext => ({
          ...prevTodosContext,
          isDeletingCompleted: false,
        }));
      });
  }, [todos, setTodosContext, inputFieldRef, setErrorMessage]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeftAmount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          type="button"
          onClick={handleFilterClick}
        >
          All
        </a>
        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterClick}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterClick}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={itemsLeftAmount === todos.length}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
