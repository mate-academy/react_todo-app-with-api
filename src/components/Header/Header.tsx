import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { ErrorContext } from '../../ErrorContext';
import { TodosContext } from '../../TodosContext';
import { USER_ID } from '../../utils/constants';

export const Header: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { setError } = useContext(ErrorContext);

  const {
    todos,
    uncompletedTodosAmount,
    addNewTodo,
    isLoading,
    setIsLoading,
    setTempTodo,
    toggleTodo,
  } = useContext(TodosContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && !isLoading) {
      titleField.current.focus();
    }
  }, [isLoading]);

  const handleSubmitNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');
      setIsLoading(false);
      setNewTodoTitle('');

      return;
    }

    if (newTodoTitle.trim()) {
      setTempTodo({
        id: 0,
        title: newTodoTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      addNewTodo({
        title: newTodoTitle.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(() => {
          setNewTodoTitle('');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const toggleAll = () => {
    const isAllTodosCompleted = todos.every(todo => todo.completed === true);

    const togglePromises = todos
      .map(todo => toggleTodo(todo, isAllTodosCompleted));

    Promise.all(togglePromises);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="title"
          className={cn('todoapp__toggle-all', {
            active: !uncompletedTodosAmount,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmitNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
