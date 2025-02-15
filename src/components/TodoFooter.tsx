import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectStatus } from '../types/SelectStatus';
import { deleteTodo } from '../api/todos';

interface Props {
  todos: Todo[];
  setErrorMessage: (value: string) => void;
  setTodos: (value: (current: Todo[]) => Todo[]) => void;
  onSelectChange: (value: Todo[]) => void;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTodos,
  onSelectChange,
}) => {
  const [selectStatus, setSelectStatus] = useState<SelectStatus>('All');
  const completedTodosCount = todos.reduce((prev, todo) => {
    if (todo.completed) {
      return prev + 1;
    }

    return prev;
  }, 0);

  useEffect(() => {
    onSelectChange(
      todos.filter(todo => {
        switch (selectStatus) {
          case 'Active':
            return !todo.completed;
          case 'Completed':
            return todo.completed;
          case 'All':
          default:
            return true;
        }
      }),
    );
  }, [selectStatus, todos, onSelectChange]);

  const handleSelectStatus = (
    e: React.MouseEvent<HTMLAnchorElement>,
    filterBy: SelectStatus,
  ) => {
    e.preventDefault();
    setSelectStatus(filterBy);
  };

  const handleDeleteCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const successfullyDeleted: Todo[] = [];

    const deleteTasks = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(deleteTasks).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          setErrorMessage('Unable to delete a todo');
        } else {
          successfullyDeleted.push(completedTodos[index]);
        }
      });
      setTodos(current =>
        current.filter(todo => !successfullyDeleted.includes(todo)),
      );
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectStatus === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={e => handleSelectStatus(e, 'All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectStatus === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={e => handleSelectStatus(e, 'Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectStatus === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => handleSelectStatus(e, 'Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodo}
        disabled={!completedTodosCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
