import classNames from 'classnames';
import React, { useEffect, useState, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { deleteTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';

type Props = {
  selectedLink: FilterType;
  setSelectedLink: (arg: FilterType) => void;
  todos: Todo[];
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (arg: string) => void;
  allTodos: Todo[];
  isSubmitting: boolean;
  setLoadingTodo: (arg: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  selectedLink,
  setSelectedLink,
  todos,
  setAllTodos,
  setErrorMessage,
  allTodos,
  isSubmitting,
  setLoadingTodo,
}) => {
  const [remainingTodosCount, setRemainingTodosCount] = useState(0);

  const newCount = useMemo(
    () => allTodos.filter(todo => !todo.completed).length,
    [allTodos],
  );

  useEffect(() => {
    if (
      !isSubmitting &&
      selectedLink !== FilterType.active &&
      newCount !== remainingTodosCount
    ) {
      setRemainingTodosCount(newCount);
    }
  }, [selectedLink, newCount, remainingTodosCount, isSubmitting]);

  const handleClearCompleted = async () => {
    setLoadingTodo(true);

    const allCompletedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      allCompletedTodos.map(todo => deleteTodo(todo.id)),
    );

    const failedIds = results.reduce<number[]>((acc, result, index) => {
      if (result.status === 'rejected') {
        acc.push(allCompletedTodos[index].id);
      }

      return acc;
    }, []);

    const successfullyDeletedIds = allCompletedTodos
      .map(todo => todo.id)
      .filter(id => !failedIds.includes(id));

    setAllTodos(prevTodos =>
      prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setErrorMessage(ErrorType.DeleteTodo);
    }

    setLoadingTodo(false);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => (
          <a
            href="#"
            key={type}
            className={classNames('filter__link', {
              selected: selectedLink === type,
            })}
            data-cy={
              type === FilterType.All ? 'FilterLinkAll' : `FilterLink${type}`
            }
            onClick={() => setSelectedLink(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
