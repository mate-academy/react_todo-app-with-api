import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onAdd: (title: string) => Promise<void>;
  onUpdate: (id: number, todoData: Partial<Todo>) => Promise<void>;
};

export const Header: React.FC<Props> = ({ todos, onAdd, onUpdate }) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmiting] = useState(false);

  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const haveActive = todos.some(todo => !todo.completed);
    const todosToUpdate = haveActive
      ? todos.filter(todo => !todo.completed)
      : todos;

    todosToUpdate.forEach(todo => onUpdate(todo.id, { completed: haveActive }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmiting(true);

    onAdd(title)
      .then(() => setTitle(''))
      // dont forget to include CATCH repeatedly
      .catch(() => {})
      .finally(() => setIsSubmiting(false));
  };

  useEffect(() => {
    titleField.current?.focus();
  }, [todos, isSubmitting]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
