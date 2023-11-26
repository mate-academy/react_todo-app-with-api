import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext';
import { TodoStatus } from '../types/TodoStatus';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/Error';

export const TodosFilter: React.FC = () => {
  const {
    todos,
    setTodos,
    setIsClearCompleted,
    setError,
    inputRef,
    selectedType,
    setSelectedType,
  } = useContext(TodoContext);

  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleClearCompleted = async () => {
    setIsClearCompleted(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
        setTodos(prevTodos => prevTodos.filter(currentTodo => currentTodo.id
          !== todo.id));
      }));
    } catch (error) {
      setError(Error.DeleteTodo);
    } finally {
      setIsClearCompleted(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const unCompletedCount = todos.filter(
    todo => todo.completed === false,
  ).length;

  const filterLinks = [
    {
      type: TodoStatus.All,
      label: 'All',
      dataCy: 'FilterLinkAll',
    },
    {
      type: TodoStatus.Active,
      label: 'Active',
      dataCy: 'FilterLinkActive',
    },
    {
      type: TodoStatus.Completed,
      label: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.type}
            href={`#/${link.type.toLowerCase()}`}
            className={cn(
              'filter__link', { selected: selectedType === link.type },
            )}
            data-cy={link.dataCy}
            onClick={() => setSelectedType(link.type)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
