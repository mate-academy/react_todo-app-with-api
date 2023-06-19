import classNames from 'classnames';
import React, { useState, FormEvent, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface TodoHeaderProps {
  newTodoField: React.RefObject<HTMLInputElement>;
  showError: (message: string) => void
  isAddingTodo: boolean
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>
  isAllTodosCompleted: boolean
  onToogleTodoStatus: () => void
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  newTodoField,
  showError,
  isAddingTodo,
  onAddTodo,
  isAllTodosCompleted,
  onToogleTodoStatus,
}) => {
  const [title, setTitle] = useState('');
  const user = useContext(AuthContext);

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError('Title is required');

      return;
    }

    if (!user) {
      showError('User not found');

      return;
    }

    try {
      await onAddTodo({
        title,
        userId: user?.id,
        completed: false,
      });

      setTitle('');
    } catch {
      const inputRef = newTodoField.current;

      if (inputRef) {
        setTimeout(() => inputRef.focus(), 0);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        onClick={onToogleTodoStatus}
      />

      <form onSubmit={onSubmitForm}>
        <input
          disabled={isAddingTodo}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
