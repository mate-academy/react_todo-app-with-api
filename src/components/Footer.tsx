import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../enums/FilterType';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  loadingTodoId: number[];
  setLoadingTodoId: (arg: number[]) => void;
  selectedLink: FilterType;
  setSelectedLink: (arg: FilterType) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoId,
  setLoadingTodoId,
  selectedLink,
  setSelectedLink,
}) => {
  const [numOfActiveTodos, setNumOfActiveTodos] = useState<number>();

  useEffect(() => {
    if (loadingTodoId.length === 0) {
      setNumOfActiveTodos(todos.filter(todo => !todo.completed).length);
    }
  }, [todos, loadingTodoId]);

  const handleClearCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);
    const todoIds = allCompletedTodos.map(todoElem => todoElem.id);

    setLoadingTodoId(todoIds);

    Promise.allSettled(allCompletedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const failedIds = results
          .map((result, index) =>
            result.status === 'rejected' ? allCompletedTodos[index].id : null,
          )
          .filter((id): id is number => id !== null);
        const successfullyDeletedIds = allCompletedTodos
          .map(todo => todo.id)
          .filter(id => !failedIds.includes(id));

        const updatedTodos = todos.filter(
          todo => !successfullyDeletedIds.includes(todo.id),
        );

        setTodos(updatedTodos);
        setLoadingTodoId([]);
        if (failedIds.length > 0) {
          setErrorMessage('Unable to delete a todo');
        }
      },
    );
  };

  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numOfActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => {
          return (
            <a
              href="#/"
              key={type}
              className={classNames('filter__link', {
                selected: selectedLink === type,
              })}
              data-cy={type === 'All' ? 'FilterLinkAll' : `FilterLink${type}`}
              onClick={() => setSelectedLink(type)}
            >
              {type}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
