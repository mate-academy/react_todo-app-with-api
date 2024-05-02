import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/Context';
import cn from 'classnames';

export const Header: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    state: { todos },
    addTodo,
    updateTodo,
    setError,
    setLoadingItems,
  } = useAppContext();

  const mainInputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = inputText.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    addTodo(title)
      .then(() => setInputText(''))
      .catch(() => {
        setIsSubmitting(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleToggleAllClick = () => {
    if (allCompleted) {
      setLoadingItems(todos.map(todo => todo.id));
      Promise.all([
        todos.forEach(todo =>
          updateTodo({ ...todo, completed: !todo.completed }).finally(() =>
            setLoadingItems([]),
          ),
        ),
      ]);

      return;
    }

    const notComleted = todos.filter(t => !t.completed);

    setLoadingItems(notComleted.map(todo => todo.id));
    Promise.all([
      notComleted.forEach(todo =>
        updateTodo({ ...todo, completed: true }).finally(() =>
          setLoadingItems([]),
        ),
      ),
    ]);
  };

  useEffect(() => {
    if (mainInputRef.current) {
      mainInputRef.current.focus();
    }
  }, [todos.length, isSubmitting]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={mainInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
