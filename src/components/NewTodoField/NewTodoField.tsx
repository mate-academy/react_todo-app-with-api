import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  addNewTodo: (title: string) => void;
  setErrorMessage: (message: string) => void;
  setHasError: (val: boolean) => void;
  todos: Todo[];
  toggleAll: () => void;
};

export const NewTodoField: React.FC<Props> = ({
  newTodoField,
  isAdding,
  addNewTodo,
  setErrorMessage,
  setHasError,
  todos,
  toggleAll,
}) => {
  const [title, setTitle] = useState('');

  const isAllCompleted = (allTodos: Todo[]) => (
    allTodos.every(todo => todo.completed)
  );

  const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    addNewTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted(todos) },
          )}
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
