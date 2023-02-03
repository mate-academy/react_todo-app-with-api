/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  memo, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  lengthOfTodos: number,
  isAllCompleted: boolean,
  showError: (errorMessage: string) => void,
  addingNewTodo: (dataFromTodo: Omit<Todo, 'id'>) => void,
  isAdding: boolean,
  toggleTodosStatuses: () => void,
};

export const AppHeader: React.FC<Props> = memo(({
  lengthOfTodos,
  isAllCompleted,
  showError,
  addingNewTodo,
  isAdding,
  toggleTodosStatuses,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      showError('Can`t find user');

      return;
    }

    if (!title.trim()) {
      showError('Title cannot be empty');

      return;
    }

    addingNewTodo({
      title,
      userId: user.id,
      completed: false,
    });

    setTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [handleSubmit]);

  return (
    <header className="todoapp__header">
      {lengthOfTodos !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: isAllCompleted })}
          onClick={toggleTodosStatuses}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
