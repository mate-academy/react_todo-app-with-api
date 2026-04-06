import React from 'react';
import { Filter } from '../App';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type FooterProps = {
  todos: Todo[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

type FilterItem = {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  setProcessingIds,
  setTodos,
  setError,
  inputRef,
  filter,
  setFilter,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setProcessingIds(completedTodos.map(todo => todo.id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    );

    const failed = results
      .map((res, i) => ({ res, id: completedTodos[i].id }))
      .filter(r => r.res.status === 'rejected')
      .map(r => r.id);

    setTodos(prev =>
      prev.filter(todo => !todo.completed || failed.includes(todo.id)),
    );
    setProcessingIds(prev => prev.filter(id => failed.includes(id)));

    if (failed.length > 0) {
      setError(ErrorMessage.DeleteTodo);

      setTimeout(() => {
        setError('');
      }, 3000);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const filters: FilterItem[] = [
    {
      label: 'All',
      value: Filter.All,
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      value: Filter.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      value: Filter.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(item => (
          <a
            key={item.value}
            href={item.href}
            className={`filter__link ${filter === item.value ? 'selected' : ''}`}
            data-cy={item.dataCy}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(t => t.completed).length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
