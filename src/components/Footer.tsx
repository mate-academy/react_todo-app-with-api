import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalContex } from '../TodoContext';
import { Filter } from '../types/Filter';
import { TodoErrors } from '../types/TodoErrors';
import { Todo } from '../types/Todo';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    deleteTodoItem,
    setIsCompletedRemoving,
    setError,
    setErrorId,
    setIsTitleOnFocus,
  } = useContext(GlobalContex);

  const [numberOfItemsLeft, setNumberOfItemsLeft] = useState(todos
    .filter(todo => !todo.completed).length);

  useEffect(() => {
    setNumberOfItemsLeft(() => todos.filter(todo => !todo.completed).length);
  }, [todos]);

  const handleFilterClick = (selectedFilter: Filter) => {
    setFilter(selectedFilter);
  };

  const errorAction = () => {
    setErrorId(Date.now());
    setError(() => TodoErrors.Delete);
  };

  const handleClearTodosClick = () => {
    setIsCompletedRemoving((previousItem: boolean) => !previousItem);
    setIsTitleOnFocus((previousState) => !previousState);

    todos
      .filter(todo => todo.completed)
      .forEach(async (todo) => {
        // const deletedItem = await deleteTodoItem(todo.id);

        // try {
        //   if (deletedItem) {
        //     setTodos((previousTodos: Todo[]) => previousTodos
        //       .filter(todoItem => todoItem.id !== todo.id));
        //   }
        // } catch (err) {
        //   setErrorId(Date.now());
        //   setError(() => TodoErrors.Delete);
        // } finally {
        //   setIsCompletedRemoving((previousItem: boolean) => !previousItem);
        //   setIsTitleOnFocus((previousState) => !previousState);
        // }
        // let test = todo.id;

        // if (test === 327589) {
        //   test = 1000000;
        // }

        deleteTodoItem(todo.id)
          .then(deletedItem => {
            if (deletedItem) {
              setTodos((previousTodos: Todo[]) => previousTodos
                .filter(todoItem => todoItem.id !== todo.id));
            } else {
              errorAction();
            }
          })
          .catch(() => errorAction())
          .finally(() => {
            setIsCompletedRemoving((previousItem: boolean) => !previousItem);
            setIsTitleOnFocus((previousState) => !previousState);
          });
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfItemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterClick(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterClick(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterClick(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearTodosClick}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
