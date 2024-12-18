import React, { useCallback } from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';
import { capitalizeFirstLetter, filterOptions } from '../Helpers/Helpers';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/Status';

type Props = {
  todoList: Todo[];
  updateTodolist: React.Dispatch<React.SetStateAction<Todo[]>>;
  status: TodoStatus;
  onStatusChange: (status: TodoStatus) => void;
  updateProcessedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onError: React.Dispatch<React.SetStateAction<string>>;
};

export const Footer: React.FC<Props> = ({
  todoList,
  updateTodolist,
  status,
  onStatusChange,
  updateProcessedIds,
  onError,
}) => {
  const activeTodos = useMemo(
    () => todoList.filter(todo => !todo.completed),
    [todoList],
  );
  const isAnyCompleted = useMemo(
    () => todoList.some(todo => todo.completed),
    [todoList],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    todoList.forEach(todo => {
      if (todo.completed) {
        updateProcessedIds(existing => [...existing, todo.id]);
        deleteTodo(todo.id)
          .then(() =>
            updateTodolist(existing =>
              existing.filter(current => current.id !== todo.id),
            ),
          )
          .catch(() => onError('Unable to delete a todo'))
          .finally(() => {
            updateProcessedIds(existing =>
              existing.filter(id => id !== todo.id),
            );
          });
      }
    });
  }, [todoList]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => {
          const formattedOption = capitalizeFirstLetter(option);

          return (
            <a
              href={option === 'all' ? '#/' : `#/${option}`}
              key={option}
              className={classNames('filter__link', {
                selected: status === option,
              })}
              data-cy={`FilterLink${formattedOption}`}
              onClick={() => onStatusChange(option)}
            >
              {formattedOption}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompleted}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
