/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterName } from '../types/enumFilterName';
import { useCallback } from 'react';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/enumError';

type Props = {
  activeCount: number;
  filteredBy: FilterName;
  setFilteredBy: React.Dispatch<React.SetStateAction<FilterName>>;
  completedTodos: Todo[];
  todos: Todo[];
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filteredBy,
  setFilteredBy,
  completedTodos,
  todos,
  setLoadingTodoId,
  setTodos,
  setErrorMessage,
  inputRef,
}) => {
  const deletePost = useCallback((todoId: number) => {
    setLoadingTodoId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
        setTimeout(() => setErrorMessage(Error.Default), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
        inputRef.current?.focus();
      });
  }, []);

  const deleteCompleted = useCallback(() => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(id => deletePost(id));
  }, [todos, deletePost]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterName).map(link => (
          <a
            key={link}
            onClick={() => setFilteredBy(link)}
            href="#/"
            className={cn('filter__link', {
              selected: filteredBy === link,
            })}
            data-cy={`FilterLink${link}`}
          >
            {link}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
