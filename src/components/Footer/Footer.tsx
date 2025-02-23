import React from 'react';

import { SortBy } from '../../types/SortBy';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { counterActiveTodos } from '../../utils/counterActiveTodos';
import * as todoService from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type TodosFunction = {
  (todos: Todo[]): void;
  (callback: (currentTodos: Todo[]) => Todo[]): void;
};

type Props = {
  setSelectedSort: (el: SortBy) => void;
  todos: Todo[];
  howSort: SortBy;
  setTodos: TodosFunction;
  setErrorMessage: (el: string) => void;
  focusInput: () => void;
  setIsDeleting: (el: boolean) => void;
  setDeletingListId: (ids: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  setSelectedSort,
  todos,
  howSort,
  setTodos,
  setErrorMessage,
  focusInput,
  setIsDeleting,
  setDeletingListId,
}) => {
  const handleClearCompleted = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodosIds.length === 0) {
      return;
    }

    setDeletingListId(completedTodosIds);
    setIsDeleting(true);

    Promise.allSettled(
      completedTodosIds.map(async todoId => {
        try {
          await todoService.deleteTodo(todoId);
          setTodos((currentTodos: Todo[]) =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        } catch {
          showErrorMesage('Unable to delete a todo', setErrorMessage);
        }
      }),
    ).finally(() => {
      setDeletingListId([]);
      setIsDeleting(false);
      setTimeout(() => {
        focusInput();
      }, 0);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counterActiveTodos(todos)} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(SortBy).map(enumElement => {
          return (
            <a
              key={enumElement}
              href="#/"
              className={cn('filter__link', {
                selected: howSort === enumElement,
              })}
              data-cy={`FilterLink${enumElement}`}
              onClick={() => setSelectedSort(enumElement)}
            >
              {enumElement}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={() => {
          handleClearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
