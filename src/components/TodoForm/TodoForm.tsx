import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useState } from 'react';

type Props = {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<boolean>;
  onToggleAll: (completed: boolean) => Promise<void>;
  isLoading: boolean;
  inputField: React.RefObject<HTMLInputElement>;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
  onToggleAll,
  isLoading,
  inputField,
}) => {
  const isAllCompleted = todos?.every(todo => todo.completed);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isLoading) {
      inputField.current?.focus();
    }
  }, [isLoading, inputField]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onAddTodo(title.trim()).then(success => {
      if (success) {
        setTitle('');
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            onToggleAll(!isAllCompleted);
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
